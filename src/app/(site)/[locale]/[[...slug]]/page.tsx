import { notFound } from 'next/navigation';
import { isLocale,locales,pageKeys,routes,pageFromSlug } from '@/lib/routes';
import { metadataFor,structuredData } from '@/lib/seo';
import { PageContent } from '@/components/pages';
type Props={params:Promise<{locale:string;slug?:string[]}>};
export function generateStaticParams(){return locales.flatMap(locale=>pageKeys.map(key=>({locale,slug:routes[key][locale]?routes[key][locale].split('/'):[]})));}
export async function generateMetadata({params}:Props){const {locale,slug=[]}=await params;if(!isLocale(locale))notFound();const key=pageFromSlug(locale,slug.join('/'));if(!key)notFound();return metadataFor(locale,key);}
export default async function Page({params}:Props){const {locale,slug=[]}=await params;if(!isLocale(locale))notFound();const key=pageFromSlug(locale,slug.join('/'));if(!key)notFound();return <main id="main"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData(locale,key)).replace(/</g,'\\u003c')}}/><PageContent locale={locale} page={key}/></main>;}
