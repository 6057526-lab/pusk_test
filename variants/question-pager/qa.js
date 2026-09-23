async(page)=>{
 const assert=(x,m)=>{if(!x)throw Error(m)},errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/variants/question-pager/index.html');await page.evaluate(()=>localStorage.removeItem('pusk:question-pager:v1'));await page.reload();await page.setViewportSize({width:390,height:664});
 await page.getByRole('button',{name:'Начать визит',exact:true}).click();await page.locator('#pbo-trigger').click();await page.getByRole('button',{name:'3333333 Test Hub',exact:true}).click();await page.getByRole('button',{name:'Заполнить визит',exact:true}).click();await page.locator('[data-action="agree-food"]').click();
 assert(await page.locator('.toc-category').count()===2,'category hierarchy');await page.locator('.toc-section summary').first().click();await page.screenshot({path:'output/playwright/x4-toc.png'});await page.locator('.toc-question').first().click();
 assert(await page.locator('.audit-green').count()===1,'one question');assert(await page.locator('[data-action="question-prev"]').isDisabled(),'first prev');
 await page.getByRole('radio',{name:'Нет',exact:true}).check();await page.getByRole('checkbox').first().check();await page.locator('.comment-details summary').click();await page.locator('#food-form-body .comment-box').fill('X4 сохранение');
 assert(await page.locator('.audit-green').getAttribute('data-qid')==='10.FS','auto advanced');
 await page.locator('[data-action="group-next"]').click();await page.locator('[data-action="question-prev"]').click();assert(await page.locator('#food-form-body .comment-box').inputValue()==='X4 сохранение','return comment');
 await page.locator('#food-scroll').evaluate(el=>el.scrollTop=0);await page.screenshot({path:'output/playwright/x4-question.png'});
 // Exercise the touch-pointer handlers, including interactive-target exclusion.
 const swipe=async(target)=>{await target.dispatchEvent('pointerdown',{pointerType:'touch',pointerId:1,clientX:280,clientY:250});await target.dispatchEvent('pointerup',{pointerType:'touch',pointerId:1,clientX:90,clientY:253});};
 await swipe(page.locator('#food-form-body .comment-box'));assert(await page.locator('.audit-green').getAttribute('data-qid')==='10.FS','input swipe moved');await swipe(page.locator('.q-text'));assert(await page.locator('.audit-green').getAttribute('data-qid')==='11.FS','swipe failed');
 await page.reload();await page.getByRole('button',{name:'Продолжить заполнение',exact:true}).click();assert(await page.locator('.audit-green').getAttribute('data-qid')==='11.FS','reload position');
 await page.locator('[data-action="question-prev"]').click();
 for(let i=0;i<48;i++){
  assert(await page.locator('.audit-green').count()===1,'single question '+i);
  if(!await page.locator('.audit-green input[type=radio]:checked').count())await page.getByRole('radio',{name:'Да',exact:true}).check();
  if(i===38)assert((await page.locator('[data-action="group-next"]').innerText()).includes('группа'),'category boundary');
  await page.locator('[data-action="group-next"]').click();
 }
 await page.locator('[data-screen="review-food"].active').waitFor();await page.locator('[data-action="review-confirm"]').click();await page.locator('[data-action="confirm-food"]').click();await page.getByRole('button',{name:'Открыть результаты',exact:true}).click();assert((await page.locator('[data-screen="results-food"] .report-sheet').first().innerText()).includes('X4 сохранение'),'report');
 assert(!errors.length,errors.join(';'));return {status:'PASS',checks:['hierarchy','one question','no auto advance','previous/next','comment/reason','pointer swipe and input exclusion','reload position','48 answers','category boundary','completion/report'],errors};
}

