async(page)=>{
 const assert=(x,m)=>{if(!x)throw Error(m)},errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/variants/question-pager/index.html');
 // Reproduce the reported case: the final unanswered question is in the middle.
 await page.evaluate(()=>{const qs=window.PUSK_QUESTIONS.flatMap(c=>c.sections.flatMap(s=>s.questions));if(qs.length!==48)throw Error('Unexpected test fixture');const answers=Object.fromEntries(qs.map(q=>[q.id,'Да']));delete answers[qs[3].id];localStorage.setItem('pusk:question-pager:v1',JSON.stringify({version:1,visitStarted:true,foodAgreed:true,foodDone:false,groupIdx:3,visitPbo:'Test Hub',visitDate:'22.09.2026',answers,reasons:{},comments:{},photos:{}}));});
 await page.reload();await page.getByRole('button',{name:'Продолжить заполнение',exact:true}).click();await page.getByRole('radio',{name:'Да',exact:true}).check();
 assert((await page.locator('[data-action="group-next"]').innerText()).includes('Проверить и завершить'),'48/48 action');await page.locator('[data-action="group-next"]').click();await page.locator('[data-screen="review-food"].active').waitFor();
 await page.locator('[data-action="review-edit"]').first().click();await page.locator('[data-action="group-next"]').click();await page.locator('[data-screen="review-food"].active').waitFor();
 await page.goto('http://127.0.0.1:8767/demo/index.html#question-pager');await page.setViewportSize({width:390,height:664});
 let id='question-pager';
 const switchTo=async(next)=>{const f=page.frameLocator('#'+id);await f.locator('.screen.active').getByRole('button',{name:'Меню',exact:true}).click();await f.locator('.demo-options summary').click();await f.getByRole('combobox',{name:'Вариант прототипа'}).selectOption(next);id=next;await page.frameLocator('#'+id).locator('.screen.active').waitFor();};
 const x4=page.frameLocator('#question-pager');await x4.getByRole('button',{name:'Продолжить заполнение',exact:true}).click();
 for(const next of ['current-mobile','product-proposal','visit-workspace','baseline','question-pager'])await switchTo(next);
 assert(await x4.locator('[data-screen="form-food"].active').isVisible(),'switch lost X4 state');
 for(const width of [334,390,768,1280]){await page.setViewportSize({width,height:740});const b=await page.locator('#question-pager').boundingBox();assert(b.x===0&&b.y===0&&b.width===width&&b.height===740,'host frame');assert(!await x4.locator('#food-scroll').evaluate(el=>el.scrollWidth>el.clientWidth+1),'content overflow');}
 await page.setViewportSize({width:390,height:664});await page.screenshot({path:'output/playwright/release-x4.png'});
 await x4.locator('.screen.active').getByRole('button',{name:'Меню',exact:true}).click();if(!await x4.locator('.demo-options').getAttribute('open')){if(await x4.locator('.demo-options').evaluate(el=>!el.open))await x4.locator('.demo-options summary').click();}await x4.locator('.demo-options').scrollIntoViewIfNeeded();await page.screenshot({path:'output/playwright/release-menu.png'});
 // A reset must preserve another variant's stored visit.
 const previous=await page.evaluate(()=>localStorage.getItem('pusk:visit-workspace:v1'));
 page.once('dialog',d=>d.accept());await x4.locator('.demo-reset').click();
 await x4.getByRole('button',{name:'Начать визит',exact:true}).waitFor();
 assert(await page.evaluate(()=>localStorage.getItem('pusk:question-pager:v1'))===null,'X4 reset');assert(await page.evaluate(()=>localStorage.getItem('pusk:visit-workspace:v1'))===previous,'reset leaked');
 assert(!errors.length,errors.join(';'));return {status:'PASS',checks:['48/48 completed in middle','review edit return','five versions via burger','preserved screen','full viewport 334/390/768/1280','reset isolation'],errors};
}

