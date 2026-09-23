async(page)=>{
 const assert=(x,m)=>{if(!x)throw Error(m)};
 assert(await page.evaluate(()=>localStorage.getItem('pusk:visit-workspace:v1'))===null,'reset not clean');
 await page.getByRole('button',{name:'Начать визит',exact:true}).waitFor();
 await page.goto('http://127.0.0.1:8767/demo/index.html');await page.setViewportSize({width:1100,height:980});
 await page.getByRole('button',{name:'X3 · Удобное внесение',exact:true}).click();
 const x3=page.frameLocator('#visit-workspace');
 await x3.getByRole('button',{name:'Начать визит',exact:true}).click();await x3.locator('#pbo-trigger').click();await x3.getByRole('button',{name:'3333333 Test Hub',exact:true}).click();await x3.getByRole('button',{name:'Заполнить визит',exact:true}).click();await x3.locator('[data-action="agree-food"]').click();await x3.locator('[data-action="open-group"]').first().click();
 await x3.locator('.audit-green').first().getByRole('radio',{name:'Да',exact:true}).check();
 await page.getByRole('button',{name:'X2 · Для продакта',exact:true}).click();
 await page.frameLocator('#product-proposal').locator('[data-screen="dashboard"].active').waitFor();
 await page.getByRole('button',{name:'Текущая мобильная',exact:true}).click();await page.frameLocator('#current-mobile').locator('[data-screen="dashboard"].active').waitFor();
 await page.getByRole('button',{name:'X1 · исходник',exact:true}).click();await page.frameLocator('#baseline').locator('[data-screen="dashboard"].active').waitFor();
 await page.getByRole('button',{name:'X3 · Удобное внесение',exact:true}).click();
 assert(await x3.locator('.audit-green').first().getByRole('radio',{name:'Да',exact:true}).isChecked(),'switch lost state');
 for(const size of ['334,732','390,664','406,864']){await page.locator('#size').selectOption(size);assert(!await x3.locator('#food-scroll').evaluate(el=>el.scrollWidth>el.clientWidth+1),'overflow '+size);const a=await x3.locator('#food-scroll').boundingBox(),b=await x3.locator('[data-screen="form-food"] .sticky-footer').boundingBox();assert(a.y+a.height<=b.y+1,'footer');}
 await page.screenshot({path:'output/playwright/x3-demo.png'});
 await page.evaluate(()=>localStorage.removeItem('pusk:visit-workspace:v1'));
 await page.reload();await page.getByRole('button',{name:'X3 · Удобное внесение',exact:true}).click();await x3.getByRole('button',{name:'Начать визит',exact:true}).waitFor();
 return {status:'PASS',checks:['reset','all 4 variants launch','X3 isolation','334/390/406 widths','footer','clean start']};
}
