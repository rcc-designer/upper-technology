'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { locales,href,pageFromSlug,type Locale } from '@/lib/routes';
import { content } from '@/content';
import { site } from '@/lib/config';
export function Header({locale}:{locale:Locale}) {
 const [open,setOpen]=useState(false);const pathname=usePathname();const c=content[locale];
 const key=pageFromSlug(locale,pathname.split('/').slice(2).join('/'))??'home';
 return <header className="site-header"><a className="skip-link" href="#main">{c.nav.skip}</a><div className="header-inner">
 <Link href={href(locale,'home')} className="brand" aria-label="Upper Technology"><Image src="/logo-upper-technology.jpg" alt="" width={1080} height={1080} priority sizes="(max-width: 700px) 195px, 240px" /></Link>
 <button className="menu-toggle" aria-expanded={open} aria-controls="primary-navigation" onClick={()=>setOpen(!open)}>{open?c.nav.close:c.nav.menu}<span aria-hidden="true">{open?'×':'+'}</span></button>
 <nav id="primary-navigation" className={open?'navigation open':'navigation'} aria-label={c.nav.menu} onKeyDown={e=>{if(e.key==='Escape')setOpen(false)}}>
 <div className="nav-links">{(['services','industries','work','about'] as const).map(k=><Link key={k} href={href(locale,k)} aria-current={key===k?'page':undefined} onClick={()=>setOpen(false)}>{c.nav[k]}</Link>)}</div>
 <div className="language-switch" aria-label={c.nav.language}>{locales.map(l=><Link key={l} href={href(l,key)} lang={l} hrefLang={l} aria-label={site.languages[l]} aria-current={locale===l?'true':undefined} onClick={()=>setOpen(false)}>{l.toUpperCase()}</Link>)}</div>
 <Link className="header-cta" href={href(locale,'audit')} onClick={()=>setOpen(false)}>{c.nav.audit}</Link>
 </nav></div></header>;
}
