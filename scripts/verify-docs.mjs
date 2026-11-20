import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const base='http://127.0.0.1:4321';
const sitemap=fs.readFileSync('build/sitemap.xml','utf8');
const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
for (const route of routes) {
  if (route !== '/') assert.ok(route.endsWith('/'), route+' sitemap trailing slash');
}
const homeHtml=fs.readFileSync('build/index.html','utf8');
assert.ok(homeHtml.includes('G-WLBVXW3LED') && homeHtml.includes('googletagmanager.com/gtag/js'), 'GA4 gtag');
const redirects=JSON.parse(fs.readFileSync('audit-redirects.json','utf8'));
const browser=await chromium.launch();
fs.mkdirSync('test-results/docs',{recursive:true});
const results=[];
try {
 for(const width of [320,390,768,1440]) {
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
  await context.route('**/*googletagmanager.com/**', route => route.abort());
  await context.route('**/*google-analytics.com/**', route => route.abort());
  await context.route('**/*google.com/g/collect**', route => route.abort());
  const page=await context.newPage();
  for(const route of routes) {
   const response=await page.goto(base+route,{waitUntil:'networkidle'});
   assert.equal(response.status(),200,route);
   const data=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,h1:[...document.querySelectorAll('h1')].filter(x=>x.getBoundingClientRect().height>0).length,overflow:document.documentElement.scrollWidth>innerWidth+1,old:/Sequence Studio|Activation Kits?/.test(document.querySelector('main')?.innerText||''),breadcrumbText:[...document.querySelectorAll('.breadcrumbs__item')].map(el=>el.textContent.replace(/\s+/g,' ').trim()),breadcrumbItems:[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(script=>{try{const json=JSON.parse(script.textContent);const lists=(Array.isArray(json)?json:[json]).filter(entry=>entry&&entry['@type']==='BreadcrumbList');return lists.flatMap(entry=>{const items=Array.isArray(entry.itemListElement)?entry.itemListElement:[entry.itemListElement].filter(Boolean);return items.map(item=>({name:item&&item.name,item:item&&item.item}));});}catch{return [{name:'INVALID JSON-LD',item:''}];}})}));
   assert.ok(data.title&&data.description,route+' metadata');
   assert.equal(data.canonical,'https://docs.botstacks.ai'+route,route+' canonical');
   assert.ok(data.breadcrumbText.every(Boolean),route+' breadcrumb text');
   assert.ok(!data.breadcrumbItems.length||data.breadcrumbItems.length>=2,route+' breadcrumb count '+JSON.stringify(data.breadcrumbItems));
   assert.ok(data.breadcrumbItems.every(item=>typeof item.name==='string'&&item.name.trim()&&typeof item.item==='string'&&item.item.startsWith('https://docs.botstacks.ai/')&&item.item.endsWith('/')),route+' breadcrumb names');
   assert.equal(data.h1,1,route+' H1');
   assert.equal(data.overflow,false,route+' overflow at '+width);
   assert.equal(data.old,false,route+' outdated product labels');
   results.push({width,route,...data});
  }
  await page.goto(base,{waitUntil:'networkidle'});
  const brand=await page.locator('.navbar__inner .navbar__brand').boundingBox();
  const search=await page.locator('.navbar__search-input').boundingBox();
  if(search) assert.ok(brand.x+brand.width<=search.x+1,'search overlaps brand at '+width);
  const cta=page.locator('.docs-hero .button');
  const button=await cta.boundingBox(),hero=await page.locator('.docs-hero').boundingBox();
  assert.ok(button.x>=hero.x&&button.x+button.width<=hero.x+hero.width+1,'CTA exceeds hero');
  assert.ok(button.height>=44,'CTA touch size');
  await page.screenshot({path:`test-results/docs/home-${width}.png`,fullPage:true});
  if(width<997) {
   await page.locator('.navbar__toggle').click();
   await page.locator('.navbar-sidebar__close').waitFor({state:'visible'});
   await page.waitForFunction(()=>Math.abs(document.querySelector('.navbar-sidebar').getBoundingClientRect().x)<1);
   const close=await page.locator('.navbar-sidebar__close').boundingBox();
   const logo=await page.locator('.navbar-sidebar__brand .navbar__brand').boundingBox();
   assert.ok(close.x>=logo.x+logo.width-1,'close overlaps logo');
   assert.ok(close.width>=44&&close.height>=44,'close touch size');
   await page.screenshot({path:`test-results/docs/menu-${width}.png`});
   await page.locator('.navbar-sidebar__close').click();
   await cta.click();
   await page.waitForURL(/\/website-guides\/start\/?$/);
  }
  await context.close();
 }
 const page=await browser.newPage();
 for(const [from,to] of Object.entries(redirects)) {
  const file=path.join('build',from,'index.html');
  assert.ok(fs.existsSync(file),from+' fallback redirect');
  assert.ok(routes.some(x=>x.replace(/\/$/,'')===to.replace(/\/$/,'')),from+' redirect target');
 }
 assert.equal(new Set(results.filter(x=>x.width===320).map(x=>x.title)).size,routes.length,'duplicate titles');
 assert.equal(new Set(results.filter(x=>x.width===320).map(x=>x.description)).size,routes.length,'duplicate descriptions');
 fs.writeFileSync('test-results/docs/results.json',JSON.stringify({pages:routes.length,checks:results.length,redirects:Object.keys(redirects).length,results},null,2));
 console.log(`${routes.length} pages, ${results.length} viewport checks, ${Object.keys(redirects).length} redirect targets passed`);
} finally {await browser.close();}
