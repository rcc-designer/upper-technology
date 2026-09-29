import { after } from 'next/server';
import { handleAudit } from '@/lib/audit-handler';
import { missingServiceConfig } from '@/lib/validation';
import { rateLimit,verifyChallenge,sendEmail,forwardToCRM } from '@/lib/integrations';
export const runtime='nodejs';
export const maxDuration=30;
export async function POST(request:Request){return handleAudit(request,{
 rateLimit,verifyChallenge,sendEmail,configured:()=>missingServiceConfig().length===0,
 onSuccess(input){after(async()=>{try{await forwardToCRM(input);}catch{console.error('upper:crm_delivery_failed');}});},
});}
