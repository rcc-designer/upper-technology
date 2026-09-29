import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale,locales } from '@/lib/routes';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import '@/styles/globals.css';
export const metadata:Metadata={icons:{icon:'/favicon.png',apple:'/apple-touch-icon.png'}};
export function generateStaticParams(){return locales.map(locale=>({locale}));}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <html lang={locale==='pt'?'pt-BR':locale==='en'?'en-US':'es'}><body><Header locale={locale}/>{children}<Footer locale={locale}/></body></html>;}
