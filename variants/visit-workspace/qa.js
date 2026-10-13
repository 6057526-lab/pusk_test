async(page)=>{
const assert=(x,m)=>{if(!x)throw Error(m)},errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8767/variants/visit-workspace/index.html');
await page.evaluate(()=>localStorage.removeItem('pusk:visit-workspace:v1'));await page.reload();
await page.setViewportSize({width:390,height:664});
await page.getByRole('button',{name:'Меню',exact:true}).click();
await page.getByRole('button',{name:'Внесение визитов',exact:true}).click();
await page.getByRole('button',{name:'Аудит по Безопасности пищи New ›',exact:true}).click();
await page.locator('#pbo-trigger').click();await page.getByRole('button',{name:'3333333 Test Hub',exact:true}).click();
await page.getByRole('button',{name:'Заполнить визит',exact:true}).click();
await page.locator('button[data-task="form-food"]').click();
await page.locator('[data-screen="agreement-food"].active').waitFor();
await page.locator('[data-action="agree-food"]').click();
await page.locator('button[data-task="form-food"]').click();
await page.locator('[data-screen="visit-overview"].active').waitFor();
const count=await page.locator('.group-card').count();assert(count>2,'groups absent');
await page.screenshot({path:'output/playwright/x3-overview.png'});
await page.locator('[data-action="open-group"]').first().click();
assert(await page.locator('.audit-green').count()===4,'group size');
const q=page.locator('.audit-green[data-qid="10.FS"]');await q.getByRole('radio',{name:'Нет',exact:true}).check();
await q.getByRole('checkbox').first().check();await q.locator('summary').click();await q.getByRole('textbox').fill('X3: проверить мойку');
await page.screenshot({path:'output/playwright/x3-form.png'});
await page.locator('[data-action="group-next"]').click();
await page.reload();await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Мой визит',exact:true}).click();await page.screenshot({path:'output/playwright/x3-home.png'});await page.getByRole('button',{name:'Продолжить заполнение',exact:true}).click();
assert((await page.locator('.group-caption').innerText()).includes('блок 2/'),'resume position');
await page.getByRole('button',{name:'Разделы',exact:true}).click();await page.locator('[data-action="open-group"]').first().click();
assert(await q.getByRole('textbox').inputValue()==='X3: проверить мойку','comment persistence');
assert(await q.getByRole('checkbox').first().isChecked(),'reason persistence');
await page.getByRole('button',{name:'Разделы',exact:true}).click();await page.getByRole('button',{name:'Проверить визит',exact:true}).click();
assert(await page.locator('#food-validation').isVisible(),'validation');
assert(await page.locator('.audit-green[data-qid="11.FS"] .inline-missing').isVisible(),'jump missing');
for(let i=0;i<count;i++){
 await page.getByRole('button',{name:'Разделы',exact:true}).click();await page.locator('[data-action="open-group"]').nth(i).click();
 for(const block of await page.locator('.audit-green').all())if(!await block.locator('input[type=radio]:checked').count())await block.getByRole('radio',{name:'Да',exact:true}).check();
}
await page.getByRole('button',{name:'Разделы',exact:true}).click();assert((await page.locator('#visit-overview-body').innerText()).includes('Всё заполнено'),'complete overview');
await page.getByRole('button',{name:'Проверить визит',exact:true}).click();await page.locator('[data-screen="review-food"].active').waitFor();
await page.locator('[data-action="review-confirm"]').click();await page.locator('[data-action="confirm-food"]').click();
await page.reload();await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Мой визит',exact:true}).click();await page.getByRole('button',{name:'Открыть результаты',exact:true}).click();
assert((await page.locator('[data-screen="results-food"] .report-sheet').first().innerText()).includes('X3: проверить мойку'),'completed report persistence');
await page.locator('[data-action="finish-process-food"]').click();
await page.locator('[data-screen="tasks"].active [data-action="open-menu"]').click();await page.getByRole('button',{name:'Мой визит',exact:true}).click();
await page.evaluate(()=>{window.confirm=()=>true});await page.locator('[data-action="workspace-reset"]').click();await page.locator('[data-screen="dashboard"].active').waitFor();await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Мой визит',exact:true}).click();await page.getByRole('button',{name:'Начать визит',exact:true}).waitFor();
assert(await page.evaluate(()=>localStorage.getItem('pusk:visit-workspace:v1'))===null,'reset persisted old state');
assert(!errors.length,errors.join(';'));return {status:'PASS',groups:count,checks:['full entry and tasks','4-question blocks','autosave answer/reason/comment','resume block after reload','missing jump','48 answers','review/confirm','report after reload','reset'],errors};
}
