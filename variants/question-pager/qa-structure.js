async(page)=>{
const assert=(x,m)=>{if(!x)throw Error(m)};
await page.goto('http://127.0.0.1:8767/variants/question-pager/index.html');await page.evaluate(()=>localStorage.removeItem('pusk:question-pager:v1'));
await page.route('**/question-pager/js/questions.js',async route=>{const res=await route.fetch();await route.fulfill({response:res,body:(await res.text())+`;for(let i=2;i<7;i++)window.PUSK_QUESTIONS.push({key:'test'+i,label:'Тестовая группа '+i,sections:[{name:'Вложенный раздел '+i,questions:[{id:'test'+i,label:'T'+i,text:'Тестовый вопрос',options:['Да','Нет']}]}]});`});});
await page.reload();await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Внесение визитов',exact:true}).click();await page.getByRole('button',{name:'Аудит по Безопасности пищи New ›',exact:true}).click();await page.locator('#visit-pbo-trigger').click();await page.getByRole('option',{name:'3333333 Test Hub',exact:true}).click();await page.getByRole('button',{name:'Заполнить визит',exact:true}).click();await page.locator('[data-screen="agreement-food"].active').waitFor();await page.locator('[data-action="agree-food"]').click();await page.locator('[data-screen="form-food"].active').waitFor();await page.getByRole('button',{name:'Все разделы',exact:true}).click();await page.locator('[data-screen="visit-overview"].active').waitFor();assert(await page.locator('.toc-category').count()===7,'7 categories');
await page.locator('.toc-category').last().locator(':scope > summary').click();await page.locator('.toc-category').last().locator('.toc-section > summary').click();await page.locator('.toc-category').last().locator('.toc-question').click();assert((await page.locator('.group-caption').innerText()).includes('Тестовая группа 6'),'last category label');assert((await page.locator('.question-position').innerText()).includes('Вложенный раздел 6'),'nested label');
for(const width of [334,390,406]){await page.setViewportSize({width,height:664});assert(!await page.locator('#food-scroll').evaluate(el=>el.scrollWidth>el.clientWidth+1),'overflow');const a=await page.locator('#food-scroll').boundingBox(),b=await page.locator('[data-screen="form-food"] .sticky-footer').boundingBox();assert(a.y+a.height<=b.y+1,'footer');}
await page.unroute('**/question-pager/js/questions.js');await page.evaluate(()=>localStorage.removeItem('pusk:question-pager:v1'));
await page.goto('http://127.0.0.1:8767/demo/index.html');await page.setViewportSize({width:1200,height:980});
let current='question-pager';
for(const id of ['baseline','question-pager']){
 const frame=page.frameLocator('#'+current);
 await frame.locator('[data-action="open-menu"]').first().click();
 if(!await frame.locator('.demo-options').evaluate(el=>el.open))await frame.locator('.demo-options summary').click();
 await frame.locator('#demo-variant').selectOption(id);
 await page.frameLocator('#'+id).locator('.screen.active').waitFor();
 current=id;
}
assert((await page.frameLocator('#question-pager').locator('.demo-options a').getAttribute('href')).includes('question-pager'),'direct');
await page.screenshot({path:'output/playwright/x4-demo.png'});
return {status:'PASS',checks:['seven groups with nested sections (test fixture only)','arbitrary category labels','334/390/406 widths','footer','X1 and X4 launch','X4 direct link']};
}
