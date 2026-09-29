import { auditSchema } from './validation';
import type { AuditInput } from './validation';
function reply(status:number,code:string) { return Response.json({ok:status===200,code},{status,headers:{'Cache-Control':'no-store',...(status===429?{'Retry-After':'900'}:{})}}); }
async function boundedBody(req:Request):Promise<string> {
  if(!req.body) return '';
  const reader=req.body.getReader();let size=0;const chunks:Uint8Array[]=[];
  for(;;) { const {done,value}=await reader.read();if(done) break;size+=value.byteLength;if(size>12000){await reader.cancel();throw new Error('too_large');}chunks.push(value); }
  return Buffer.concat(chunks).toString('utf8');
}
export type Dependencies={rateLimit:(id:string)=>Promise<boolean>;verifyChallenge:(token:string,hostname:string)=>Promise<boolean>;sendEmail:(input:AuditInput)=>Promise<void>;onSuccess:(input:AuditInput)=>void;configured:()=>boolean};
export async function handleAudit(request:Request,deps:Dependencies) {
  const {rateLimit,verifyChallenge,sendEmail}=deps;
  const origin=request.headers.get('origin');
  const expected=process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : new URL(request.url).origin;
  if(origin!==expected) return reply(403,'origin');
  if(!request.headers.get('content-type')?.includes('application/json')) return reply(415,'content_type');
  let body:unknown;
  try { body=JSON.parse(await boundedBody(request)); } catch { return reply(400,'invalid'); }
  const parsed=auditSchema.safeParse(body);
  if(!parsed.success) return reply(422,'invalid');
  const input=parsed.data;
  const elapsed=Date.now()-input.startedAt;
  if(elapsed<2500 || elapsed>86400000) return reply(422,'invalid');
  if(!deps.configured()) return reply(503,'unavailable');
  try {
    // Trust the Vercel edge header, or a header overwritten by YOUR trusted proxy.
    const header=process.env.VERCEL ? 'x-vercel-forwarded-for' : process.env.TRUSTED_IP_HEADER;
    const address=header ? request.headers.get(header)?.split(',')[0].trim() : undefined;
    if(!address) return reply(503,'unavailable');
    if(!await rateLimit(`ip:${address}`) || !await rateLimit(`email:${input.email.toLowerCase()}`)) return reply(429,'limited');
    if(!input.turnstileToken || !await verifyChallenge(input.turnstileToken,new URL(expected).hostname)) return reply(422,'challenge');
    await sendEmail(input);
    deps.onSuccess(input);
    return reply(200,'accepted');
  } catch { console.error('upper:request_delivery_failed');return reply(502,'unavailable'); }
}
