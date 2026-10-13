async(page)=>{
 const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
 await page.goto('http://127.0.0.1:8767/variants/question-pager/index.html');await page.evaluate(()=>localStorage.removeItem('pusk:question-pager:v1'));await page.reload();await page.setViewportSize({width:390,height:780});
 await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Внесение визитов',exact:true}).click();await page.getByRole('button',{name:'Аудит по Безопасности пищи New ›',exact:true}).click();
 assert(await page.locator('#visit-pbo-trigger').count()===1,'Современный выбор ПБО вместо системного select');
 await page.locator('#visit-pbo-trigger').click();await page.getByRole('searchbox',{name:'Номер или название ПБО'}).fill('333');
 assert(await page.locator('#visit-pbo-options [role="option"]').count()===1,'Поиск доступных ПБО');
 await page.getByRole('option',{name:'3333333 Test Hub',exact:true}).click();
 assert(await page.locator('#visit-pbo').inputValue()==='3333333 Test Hub','Выбранный ПБО');
 await page.locator('#visit-pbo-trigger').click();assert(await page.getByRole('option',{name:'3333333 Test Hub',exact:true}).getAttribute('aria-selected')==='true','Выбранный ПБО отмечен');
 await page.getByRole('searchbox',{name:'Номер или название ПБО'}).fill('не существует');assert(await page.locator('#visit-pbo-empty').isVisible(),'Пустой результат поиска');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Открыть календарь',exact:true}).click();await page.getByRole('button',{name:'Следующий месяц',exact:true}).click();await page.getByRole('button',{name:'13',exact:true}).click();
 assert(await page.locator('#visit-date').inputValue()==='13.10.2026','Выбор даты');
 assert(await page.locator('#visit-pbo').inputValue()==='3333333 Test Hub','ПБО сохраняется после календаря');
 await page.screenshot({path:'output/playwright/x4-modern-entry.png'});
 await page.getByRole('button',{name:'Заполнить визит',exact:true}).click();
 assert(await page.locator('[data-screen="agreement-food"] .badge-red,[data-screen="agreement-food"] .footer-side').count()===0,'Без служебного нуля и меню');
 assert(await page.locator('[data-screen="agreement-food"] .related-blocks').count()===0,'Без неработающих напоминаний и ленты');
 await page.locator('[data-screen="agreement-food"] .scroll-body').evaluate(el=>el.scrollTop=el.scrollHeight);await page.screenshot({path:'output/playwright/x4-clean-agreement.png'});
 return {status:'PASS',checks:['searchable PBO sheet','selection mark','empty search','Escape','date and PBO retained','clean consent']};
}
