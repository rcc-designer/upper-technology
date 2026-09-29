import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {href,locales,pageKeys} from '../../src/lib/routes';
import {content} from '../../src/content';
for(const locale of locales){
 test(`${locale}: navigation, responsive layout, workflow and accessibility`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(href(locale,'home'));await expect(page.locator('html')).toHaveAttribute('lang',locale==='pt'?'pt-BR':locale==='en'?'en-US':'es');
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const c=content[locale];await page.getByRole('button',{name:c.work.button,exact:true}).click();await expect(page.getByRole('heading',{name:c.work.steps[1],exact:true})).toBeVisible();
  if((page.viewportSize()?.width||0)<961){await page.getByRole('button',{name:c.nav.menu,exact:true}).click();await expect(page.locator('#primary-navigation')).toBeVisible();}
  await page.getByRole('link',{name:c.nav.services,exact:true}).click();await expect(page).toHaveURL(href(locale,'services'));
  await page.goto(href(locale,'audit'));const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(results.violations).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 });
}
test('form shows failure honestly and validates required fields',async({page})=>{await page.goto('/en/free-digital-business-audit');await page.getByRole('button',{name:'Send request',exact:true}).click();await expect(page.locator('input[name=name]:invalid')).toHaveCount(1);await page.getByLabel('Your name').fill('QA Tester');await page.getByLabel('Business name').fill('Test Business');await page.getByLabel('Business email').fill('qa@example.test');await page.getByLabel('What would you like to improve?').fill('We need clearer inquiry routing.');await page.locator('input[name=consent]').check();await page.route('**/api/audit',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,code:'unavailable'})}));await page.getByRole('button',{name:'Send request',exact:true}).click();await expect(page.getByRole('alert')).toContainText('temporarily unavailable');await expect(page.getByText('Your request has been sent.',{exact:true})).toHaveCount(0);});
test('every localized public route returns 200',async({request})=>{for(const locale of locales)for(const key of pageKeys){const response=await request.get(href(locale,key));expect(response.status(),href(locale,key)).toBe(200);}});
