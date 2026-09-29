import type { MetadataRoute } from 'next';
import { site } from '@/lib/config';
import { pageKeys,locales,href } from '@/lib/routes';
export default function sitemap():MetadataRoute.Sitemap {if(!site.url)return [];return pageKeys.flatMap(key=>locales.map(locale=>({url:site.url+href(locale,key),alternates:{languages:Object.fromEntries(locales.map(l=>[l==='pt'?'pt-BR':l==='en'?'en-US':'es',site.url+href(l,key)]))}})));}
