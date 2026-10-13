async(page)=>{
 const assert=(x,m)=>{if(!x)throw Error(m)};
 await page.goto('http://127.0.0.1:8767/variants/visit-workspace/index.html');
 await page.evaluate(()=>localStorage.removeItem('pusk:visit-workspace:v1'));await page.reload();
 assert(await page.evaluate(()=>localStorage.getItem('pusk:visit-workspace:v1'))===null,'reset not clean');
 await page.locator('[data-screen="dashboard"].active').waitFor();
 await page.goto('http://127.0.0.1:8767/demo/index.html');await page.setViewportSize({width:1100,height:980});
 let current='current-mobile';
 const select=async id=>{const f=page.frameLocator('#'+current);await f.locator('.screen.active .demo-menu-button, .screen.active [data-action="open-menu"]').first().click();if(!await f.locator('.demo-options').evaluate(el=>el.open))await f.locator('.demo-options summary').click();await f.locator('#demo-variant').selectOption(id);await page.frameLocator('#'+id).locator('.screen.active').waitFor();current=id;};
 await select('visit-workspace');
 const x3=page.frameLocator('#visit-workspace');
 await x3.getByRole('button',{name:'Меню',exact:true}).click();await x3.getByRole('button',{name:'Внесение визитов',exact:true}).click();await x3.getByRole('button',{name:'Аудит по Безопасности пищи New ›',exact:true}).click();await x3.locator('#pbo-trigger').click();await x3.getByRole('button',{name:'3333333 Test Hub',exact:true}).click();await x3.getByRole('button',{name:'Заполнить визит',exact:true}).click();await x3.locator('button[data-task="form-food"]').click();await x3.locator('[data-screen="agreement-food"].active').waitFor();await x3.locator('[data-action="agree-food"]').click();await x3.locator('button[data-task="form-food"]').click();await x3.locator('[data-screen="visit-overview"].active').waitFor();await x3.locator('[data-action="open-group"]').first().click();
 await x3.locator('.audit-green').first().getByRole('radio',{name:'Да',exact:true}).check();
 await select('product-proposal');
 await page.frameLocator('#product-proposal').locator('[data-screen="dashboard"].active').waitFor();
 await select('current-mobile');await page.frameLocator('#current-mobile').locator('[data-screen="dashboard"].active').waitFor();
 await select('baseline');await page.frameLocator('#baseline').locator('[data-screen="dashboard"].active').waitFor();
 await select('visit-workspace');
 assert(await x3.locator('.audit-green').first().getByRole('radio',{name:'Да',exact:true}).isChecked(),'switch lost state');
 for(const width of [334,390,406]){await page.setViewportSize({width,height:864});assert(!await x3.locator('#food-scroll').evaluate(el=>el.scrollWidth>el.clientWidth+1),'overflow '+width);const a=await x3.locator('#food-scroll').boundingBox(),b=await x3.locator('[data-screen="form-food"] .sticky-footer').boundingBox();assert(a.y+a.height<=b.y+1,'footer');}
 await page.screenshot({path:'output/playwright/x3-demo.png'});
 await page.evaluate(()=>localStorage.removeItem('pusk:visit-workspace:v1'));
 await page.reload();await x3.locator('[data-screen="dashboard"].active').waitFor();
 return {status:'PASS',checks:['reset','all 4 variants launch','X3 isolation','334/390/406 widths','footer','clean start']};
}
