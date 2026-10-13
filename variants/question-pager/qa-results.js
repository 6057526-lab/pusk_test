async(page)=>{
 const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
 await page.goto('http://127.0.0.1:8767/variants/question-pager/index.html');
 const fixture=async(answers,falsification='Нет',foodDone=false)=>{
   await page.evaluate(({answers,falsification,foodDone})=>{
     const qs=window.PUSK_QUESTIONS.flatMap(c=>c.sections.flatMap(s=>s.questions));
     const values=Object.fromEntries(qs.map(q=>[q.id,'Да']));
     Object.assign(values,answers);for(const [k,v] of Object.entries(values))if(v===null)delete values[k];
     localStorage.setItem('pusk:question-pager:v1',JSON.stringify({version:1,visitStarted:true,foodAgreed:true,foodDone,visitPbo:'3333333 Test Hub',visitDate:'22.09.2026',answers:values,reasons:{},comments:{},photos:{},groupIdx:0,falsification}));
   },{answers,falsification,foodDone});
   await page.reload();await page.getByRole('button',{name:'Меню',exact:true}).click();await page.getByRole('button',{name:'Задачи',exact:true}).click();
   await page.locator(foodDone?'button[data-task="results-food"]':'button[data-task="form-food"]').click();
   if(!foodDone){await page.locator('[data-screen="form-food"].active').waitFor();await page.getByRole('button',{name:'Все разделы',exact:true}).click();await page.locator('[data-action="finish-food"]').click();}
 };
 await fixture({});
 assert(await page.locator('#review-food-body .is-passed').count()===1,'Все Да дают удовлетворительный результат');
 assert((await page.locator('#review-food-body .summary-score').innerText()).includes('100%'),'48 Да = 100%');
 await fixture({'10.FS':'Нет'});
 assert(await page.locator('#review-food-body .is-passed').count()===1,'Некритический Нет не является критическим отказом');
 assert((await page.locator('#review-food-body .summary-score').innerText()).includes('97,9%'),'47 Да = 97,9%');
 await fixture({},'Да',true);
 assert((await page.locator('#result-summary .result-outcome').innerText())==='Неудовлетворительный результат','Фальсификация при 100% даёт неудовлетворительный результат');
 assert((await page.locator('#result-summary').innerText()).includes('Обнаружен факт фальсификации'),'Причина итоговой оценки');
 await fixture({'1.FS.Критический':null});
 assert(await page.locator('[data-screen="form-food"].active').count()===1,'Нельзя перейти к завершению с пропуском');
 assert(await page.locator('.audit-green').getAttribute('data-qid')==='1.FS.Критический','Переход к пропущенному критическому вопросу');
 await page.getByRole('radio',{name:'Да',exact:true}).check();await page.locator('[data-action="group-next"]').click();
 assert(await page.locator('#review-food-body .is-passed').count()===1,'Последний пропуск исправляет оценку');
 return {status:'PASS',checks:['all Yes','noncritical No','falsification override','missing critical question','corrected result']};
}
