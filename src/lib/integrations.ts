import { createHmac } from 'node:crypto';
import type { AuditInput } from './validation';
export function privateHash(value:string) { return createHmac('sha256',process.env.IP_HASH_SECRET!).update(value).digest('hex'); }
export async function rateLimit(identifier:string):Promise<boolean> {
  const response=await fetch(process.env.UPSTASH_REDIS_REST_URL!,{
    method:'POST',headers:{Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},
    body:JSON.stringify(['EVAL',"local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n",'1',`upper:audit:${privateHash(identifier)}`,'900']),
    signal:AbortSignal.timeout(6000),cache:'no-store',
  });
  if(!response.ok) throw new Error('rate_limit_unavailable');
  const result=await response.json();
  if(result.error || typeof result.result!=='number') throw new Error('rate_limit_invalid');
  return result.result<=5;
}
export async function verifyChallenge(token:string, expectedHostname:string):Promise<boolean> {
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
    method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:token}),signal:AbortSignal.timeout(6000),
  });
  if(!r.ok) throw new Error('challenge_unavailable');
  const v=await r.json();
  return v.success===true && v.hostname===expectedHostname && v.action==='audit';
}
export async function sendEmail(input:AuditInput):Promise<void> {
  const text=[`Request: ${input.kind}`,`Name: ${input.name}`,`Business: ${input.company}`,`Reply email: ${input.email}`,`Website: ${input.website||'Not supplied'}`,`Interest: ${input.service}`,`Language: ${input.locale}`,'',input.message,'','Consent: request-related contact accepted.'].join('\n');
  const r=await fetch('https://api.resend.com/emails',{
    method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`upper-${input.submissionId}`},
    body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:[process.env.CONTACT_TO_EMAIL],reply_to:input.email,subject:`Upper Technology | ${input.kind==='audit'?'Digital audit':'Contact'} request`,text}),
    signal:AbortSignal.timeout(10000),
  });
  const result=await r.json().catch(()=>null);
  if(!r.ok || !result?.id) throw new Error('email_not_accepted');
}
export async function forwardToCRM(input:AuditInput):Promise<void> {
  if(!process.env.CRM_WEBHOOK_URL) return;
  const url=new URL(process.env.CRM_WEBHOOK_URL);
  if(url.protocol!=='https:') throw new Error('crm_requires_https');
  const r=await fetch(url,{
    method:'POST',headers:{'Content-Type':'application/json',...(process.env.CRM_WEBHOOK_TOKEN?{Authorization:`Bearer ${process.env.CRM_WEBHOOK_TOKEN}`}:{})},
    body:JSON.stringify({name:input.name,company:input.company,email:input.email,website:input.website,service:input.service,message:input.message,locale:input.locale,kind:input.kind,submissionId:input.submissionId,consent:true}),
    signal:AbortSignal.timeout(6000),
  });
  if(!r.ok) throw new Error('crm_not_accepted');
}
