async(page)=>{
 const assert=(x,m)=>{if(!x)throw Error(m)};
 await page.goto('http://127.0.0.1:8767/demo/index.html');
 await page.setViewportSize({width:1100,height:980});
 const current=page.frameLocator('#current-mobile'),x2=page.frameLocator('#product-proposal');
 await current.getByRole('button',{name:'Меню',exact:true}).click();
 await current.getByRole('button',{name:'Внесение визитов',exact:true}).click();
 await page.getByRole('button',{name:'X2 · Для продакта',exact:true}).click();
 assert((await page.locator('#direct').getAttribute('href')).includes('product-proposal'),'direct route');
 await page.locator('#size').selectOption('390,664');
 await x2.getByRole('button',{name:'Меню',exact:true}).click();
 await x2.getByRole('button',{name:'Внесение визитов',exact:true}).click();
 await page.getByRole('button',{name:'Текущая мобильная',exact:true}).click();
 assert(await current.locator('[data-screen="visit-entry"].active').isVisible(),'current state');
 await page.getByRole('button',{name:'X2 · Для продакта',exact:true}).click();
 assert(await x2.locator('[data-screen="visit-entry"].active').isVisible(),'x2 state');
 await page.getByRole('button',{name:'Начать заново',exact:true}).click();
 await x2.locator('[data-screen="dashboard"].active').waitFor();
 await page.getByRole('button',{name:'Текущая мобильная',exact:true}).click();
 assert(await current.locator('[data-screen="visit-entry"].active').isVisible(),'reset leaked');
 await page.getByRole('button',{name:'X1 · исходник',exact:true}).click();
 await page.frameLocator('#baseline').locator('[data-screen="dashboard"].active').waitFor();
 await page.getByRole('button',{name:'X2 · Для продакта',exact:true}).click();
 await page.screenshot({path:'output/playwright/x2-demo.png'});
 return {status:'PASS',checks:['X1 original route','current route/state','X2 route/state','isolated restart','size','direct link']};
}
