import {test} from 'node:test';
import assert from 'node:assert/strict';
import {content} from '../src/content';
import {locales,pageKeys,routes,href,pageFromSlug} from '../src/lib/routes';
test('all 39 localized pages have unique paths and nonempty metadata',()=>{const seen=new Set<string>();for(const l of locales)for(const k of pageKeys){const path=href(l,k);assert.ok(!seen.has(path));seen.add(path);assert.equal(pageFromSlug(l,routes[k][l]),k);assert.ok(content[l].pages[k].title.length>3);assert.ok(content[l].pages[k].description.length>30);}assert.equal(seen.size,39);});
test('translated content has the same complete data structure',()=>{function shape(v:unknown):unknown {if(Array.isArray(v))return v.map(shape);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,shape(x)]));assert.equal(typeof v,'string');assert.ok(String(v).trim());return 'text';}assert.deepEqual(shape(content.en),shape(content.pt));assert.deepEqual(shape(content.en),shape(content.es));});
