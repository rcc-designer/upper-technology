import Link from 'next/link';
import { href,type Locale } from '@/lib/routes';
import { content } from '@/content';
import { site } from '@/lib/config';
import { Analytics,TrackedLink } from './analytics';
export function Footer({locale}:{locale:Locale}) {const c=content[locale];return <footer className="footer"><div className="wrap"><div className="footer-top"><div><p className="eyebrow">UPPER TECHNOLOGY</p><p className="footer-tagline">Build. Connect.<br/>Automate. Grow.</p></div><div><p>{c.labels.local}</p><p className="muted-light">Orlando · Kissimmee · Celebration<br/>{c.labels.remote}</p><Link className="text-link light" href={href(locale,'contact')}>{c.labels.contactUs}</Link><br/><TrackedLink className="text-link light" href={site.instagram} event="contact_click">Instagram</TrackedLink></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Upper Technology</span><div><Link href={href(locale,'privacy')}>{c.labels.privacy}</Link><Link href={href(locale,'terms')}>{c.labels.terms}</Link><Analytics locale={locale}/></div><span>EN / PT / ES</span></div></div></footer>;}
