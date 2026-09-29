import type { Metadata } from 'next';
import { content } from '@/content';
import { site } from './config';
import { href,locales,type Locale,type PageKey } from './routes';
export function metadataFor(locale:Locale,key:PageKey):Metadata {
 const p=content[locale].pages[key];const url=site.url?site.url+href(locale,key):undefined;
 return { title:key==='home'?`Upper Technology | ${p.title}`:`${p.title} | Upper Technology`,description:p.description,
 alternates:site.url?{canonical:url,languages:Object.fromEntries([...locales.map(l=>[l==='pt'?'pt-BR':l==='en'?'en-US':'es',site.url+href(l,key)]),['x-default',site.url+href('en',key)]])}:undefined,
 openGraph:{type:'website',siteName:site.name,title:p.title,description:p.description,url,locale:locale==='pt'?'pt_BR':locale==='en'?'en_US':'es_US',images:site.url?[{url:`${site.url}/logo-upper-technology.jpg`,width:1080,height:1080,alt:'Upper Technology'}]:undefined},
 twitter:{card:'summary',title:p.title,description:p.description,images:site.url?[`${site.url}/logo-upper-technology.jpg`]:undefined},
 robots:site.url?{index:true,follow:true}:{index:false,follow:false},
 verification:process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:undefined,
 };
}
export function structuredData(locale:Locale,key:PageKey) {
 const org={'@context':'https://schema.org','@type':'Organization',name:site.name,...(site.url?{url:site.url,logo:`${site.url}/logo-upper-technology.jpg`}:{}),sameAs:[site.instagram]};
 const service=content[locale].services.find(s=>s.key===key);
 return service?[org,{'@context':'https://schema.org','@type':'Service',name:service.title,description:service.description,provider:{'@type':'Organization',name:site.name},areaServed:{'@type':'Country',name:'United States'}}]:[org];
}
