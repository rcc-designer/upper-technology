'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { content } from '@/content';
import { isLocale,href } from '@/lib/routes';
export default function NotFound(){const params=useParams();const locale=typeof params.locale==='string'&&isLocale(params.locale)?params.locale:'en';const c=content[locale];return <main id="main" className="not-found wrap"><p className="eyebrow">404</p><h1>{c.notFound.title}</h1><p>{c.notFound.body}</p><Link href={href(locale,'home')} className="button">{c.notFound.button}</Link></main>;}
