export const locales = ['en','pt','es'] as const;
export type Locale = typeof locales[number];
export const routes = {
  home: { en:'', pt:'', es:'' },
  services: { en:'services', pt:'servicos', es:'servicios' },
  websites: { en:'services/websites', pt:'servicos/sites', es:'servicios/sitios-web' },
  automation: { en:'services/automation', pt:'servicos/automacao', es:'servicios/automatizacion' },
  ai: { en:'services/ai-solutions', pt:'servicos/inteligencia-artificial', es:'servicios/inteligencia-artificial' },
  industries: { en:'industries', pt:'setores', es:'sectores' },
  work: { en:'our-work', pt:'projetos', es:'proyectos' },
  demo: { en:'our-work/service-request-demo', pt:'projetos/demo-solicitacao', es:'proyectos/demo-solicitud' },
  about: { en:'about', pt:'sobre', es:'nosotros' },
  audit: { en:'free-digital-business-audit', pt:'auditoria-digital-gratuita', es:'auditoria-digital-gratuita' },
  contact: { en:'contact', pt:'contato', es:'contacto' },
  privacy: { en:'privacy-policy', pt:'politica-de-privacidade', es:'politica-de-privacidad' },
  terms: { en:'terms', pt:'termos', es:'terminos' },
} as const;
export type PageKey = keyof typeof routes;
export const pageKeys = Object.keys(routes) as PageKey[];
export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
export function href(locale: Locale, key: PageKey): string { return `/${locale}${routes[key][locale] ? '/'+routes[key][locale] : ''}`; }
export function pageFromSlug(locale: Locale, slug: string): PageKey | undefined { return pageKeys.find(key=>routes[key][locale]===slug); }
