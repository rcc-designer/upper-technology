import { z } from 'zod';
export const auditSchema = z.object({
  name:z.string().trim().min(2).max(100),
  company:z.string().trim().min(2).max(120),
  email:z.email().max(254),
  website:z.string().trim().max(300).refine(v=>!v || /^https?:\/\//i.test(v) && URL.canParse(v)),
  service:z.enum(['websites','automation','ai','unsure']),
  message:z.string().trim().min(10).max(2000),
  consent:z.literal(true),
  locale:z.enum(['en','pt','es']),
  kind:z.enum(['audit','contact']),
  companyFax:z.string().max(0),
  startedAt:z.number().positive(),
  submissionId:z.uuid(),
  turnstileToken:z.string().max(2048).optional(),
});
export type AuditInput=z.infer<typeof auditSchema>;
export const missingServiceConfig=()=>[
  !process.env.RESEND_API_KEY && 'RESEND_API_KEY',
  !process.env.CONTACT_TO_EMAIL && 'CONTACT_TO_EMAIL',
  !process.env.CONTACT_FROM_EMAIL && 'CONTACT_FROM_EMAIL',
  !process.env.UPSTASH_REDIS_REST_URL && 'UPSTASH_REDIS_REST_URL',
  !process.env.UPSTASH_REDIS_REST_TOKEN && 'UPSTASH_REDIS_REST_TOKEN',
  !process.env.IP_HASH_SECRET && 'IP_HASH_SECRET',
  !process.env.TURNSTILE_SECRET_KEY && 'TURNSTILE_SECRET_KEY',
  !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && 'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
].filter(Boolean);
