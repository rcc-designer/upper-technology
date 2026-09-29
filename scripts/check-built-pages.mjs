import fs from 'node:fs';
import path from 'node:path';
const root='.next/server/app';const files=[];
function walk(p){for(const n of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,n.name);if(n.isDirectory())walk(f);else if(n.name.endsWith('.html'))files.push(f);}}walk(root);
const pages=files.filter(p=>/\/(en|pt|es)(\/|\.html)/.test(p));const failures=[];const available=new Set(pages.map(p=>'/'+path.relative(root,p).replace(/\.html$/,'')));
for(const file of pages){const text=fs.readFileSync(file,'utf8');if((text.match(/<h1[ >]/g)||[]).length!==1)failures.push(`${file}: h1 count`);if(!text.includes('name="description"'))failures.push(`${file}: missing description`);const lang=file.includes('/pt')?'pt-BR':file.includes('/es')?'es':'en-US';if(!text.includes(`lang="${lang}"`))failures.push(`${file}: wrong lang`);for(const m of text.matchAll(/href="(\/(?:en|pt|es)[^"?#]*)/g)){if(!available.has(m[1]))failures.push(`${file}: broken internal link ${m[1]}`);}if(text.includes('application/ld+json')===false)failures.push(`${file}: missing structured data`);}
if(pages.length!==39)failures.push(`Expected 39 pages, found ${pages.length}`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('PASS: 39 pages; one H1 each; localized language and descriptions; structured data; every internal route link resolves.');
