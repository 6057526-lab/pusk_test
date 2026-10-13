async(page)=>{
 const assert=(x,m)=>{if(!x)throw Error(m)},errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:740});
 await page.goto('http://127.0.0.1:8767/variants/question-pager/index.html');
 await page.evaluate(()=>{const qs=window.PUSK_QUESTIONS.flatMap(c=>c.sections.flatMap(s=>s.questions));localStorage.setItem('pusk:question-pager:v1',JSON.stringify({version:1,visitStarted:true,foodAgreed:true,foodDone:false,groupIdx:0,visitPbo:'333',visitDate:'13.10.2026',answers:Object.fromEntries(qs.map(q=>[q.id,'Да'])),reasons:{},comments:{},photos:{}}));});
 await page.goto('http://127.0.0.1:8767/demo/index.html#question-pager');
 const x4=page.frameLocator('#question-pager');
 await x4.getByRole('button',{name:'Меню',exact:true}).click();await x4.getByRole('button',{name:'Задачи',exact:true}).click();await x4.locator('button[data-task="form-food"]').click();await x4.locator('[data-action="group-next"]').click();
 await x4.locator('[data-screen="review-food"].active').waitFor();
 const frame=page.frames().find(f=>f.url().includes('/variants/question-pager/'));
 await frame.evaluate(()=>{const create=PuskReportPdf.create;PuskReportPdf.create=(...args)=>new Promise(resolve=>{window.resumePdf=()=>resolve(create(...args));});});
 await x4.locator('[data-action="open-food-preview"]').first().click();
 await frame.waitForFunction(()=>typeof window.resumePdf==='function');
 await x4.locator('.screen.active').getByRole('button',{name:'Меню',exact:true}).click();await x4.locator('.demo-options summary').click();await x4.getByRole('combobox',{name:'Вариант прототипа'}).selectOption('baseline');
 assert(await frame.evaluate(()=>document.querySelector('.phone-shell').clientWidth===0),'X4 should be hidden during rendering');
 await frame.evaluate(()=>window.resumePdf());
 await frame.waitForFunction(()=>document.querySelector('.pdf-preview-frame canvas')&&document.querySelector('[data-screen="pdf-food"] .pdf-status').textContent==='');
 const sizes=await frame.locator('.pdf-preview-frame canvas').evaluateAll(cs=>cs.map(c=>[c.width,c.height]));
 assert(sizes.length>1&&sizes.every(([w,h])=>w>300&&h/w>1.3),'Hidden X4 produced invalid PDF canvases: '+JSON.stringify(sizes));
 const x1=page.frameLocator('#baseline');await x1.locator('.screen.active').getByRole('button',{name:'Меню',exact:true}).click();await x1.locator('.demo-options summary').click();await x1.getByRole('combobox',{name:'Вариант прототипа'}).selectOption('question-pager');
 assert(await x4.locator('.pdf-preview-frame canvas').first().isVisible(),'PDF not visible after returning');
 assert(!await frame.evaluate(()=>JSON.parse(localStorage.getItem('pusk:question-pager:v1')).foodDone),'Preview completed visit');
 assert(!errors.length,errors.join(';'));return {status:'PASS',checks:['PDF generation while another variant is visible','correct page dimensions','preview visible on return','visit remains editable'],sizes,errors};
}
