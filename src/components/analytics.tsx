'use client';
import { useEffect,useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/routes';
import { content } from '@/content';
declare global { interface Window { dataLayer?:unknown[];gtag?:(...args:unknown[])=>void; } }
const id=process.env.NEXT_PUBLIC_GA_ID;
export function track(event:'audit_submit'|'contact_submit'|'contact_click'|'schedule_click') { if(id && localStorage.getItem('upper-analytics')==='accepted') window.gtag?.('event',event); }
export function Analytics({locale}:{locale:Locale}) {
 const [choice,setChoice]=useState<string|null|undefined>(undefined);const path=usePathname();const t=content[locale].cookie;
 useEffect(()=>{const timer=setTimeout(()=>setChoice(localStorage.getItem('upper-analytics')),0);return()=>clearTimeout(timer);},[]);
 useEffect(()=>{if(!id||choice!=='accepted') return;window.dataLayer??=[];window.gtag??=function(...args:unknown[]){window.dataLayer?.push(args);};
 window.gtag('consent','update',{analytics_storage:'granted'});
 if(!document.getElementById('ga-script')){const script=document.createElement('script');script.id='ga-script';script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;document.head.appendChild(script);window.gtag('js',new Date());window.gtag('config',id,{send_page_view:false});}
 window.gtag('event','page_view',{page_path:path,page_location:window.location.origin+path});
 },[choice,path]);
 if(!id) return null;
 function choose(value:string){localStorage.setItem('upper-analytics',value);setChoice(value);if(value==='declined'){window.gtag?.('consent','update',{analytics_storage:'denied'});for(const cookie of document.cookie.split(';')){const name=cookie.trim().split('=')[0];if(name.startsWith('_ga')){document.cookie=`${name}=; Max-Age=0; path=/`;document.cookie=`${name}=; Max-Age=0; path=/; domain=.${location.hostname}`;}}window.location.reload();}}
 return <><button className="privacy-preferences" onClick={()=>setChoice(null)}>{t.settings}</button>{choice===null&&<section className="cookie-panel" aria-label={t.settings}><p>{t.text}</p><div><button className="button" onClick={()=>choose('accepted')}>{t.accept}</button><button className="button outline" onClick={()=>choose('declined')}>{t.decline}</button></div></section>}</>;
}
export function TrackedLink({href,children,event,className}:{href:string;children:React.ReactNode;event:'contact_click'|'schedule_click';className?:string}) {return <a href={href} className={className} onClick={()=>track(event)} rel={href.startsWith('http')?'noopener noreferrer':undefined}>{children}</a>;}
