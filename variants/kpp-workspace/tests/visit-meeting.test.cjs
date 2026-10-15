const {test}=require('node:test');const assert=require('node:assert/strict');const {app}=require('./helpers/app-harness.cjs');
const tick=()=>new Promise(r=>setImmediate(r));

test('home prioritizes IPUR and unfinished visits and opens checklist selection',()=>{
 const h=app({workspace:true});assert.match(h.screen(),/ПБО в IPUR/);assert.match(h.screen(),/Незавершённые визиты/);
 h.click('visit-catalog');assert.equal(h.state().view,'visit-catalog');
 assert.equal((h.screen().match(/data-action="choose-visit-type"/g)||[]).length,2);
 assert.doesNotMatch(h.screen(),/Поддерживающие визиты ПУСК|Бизнес-планирование/);
});
test('checklist comes before PBO and direct start cannot bypass site selection',()=>{
 const h=app({workspace:true});h.click('choose-visit-type',{id:'people-practices'});const count=h.state().visits.length;
 h.click('start');assert.equal(h.state().visits.length,count);assert.equal(h.state().view,'enterprise');
 h.click('select-pbo',{id:'29779'});h.click('start');const v=h.state().visits.find(v=>v.id===h.state().active);
 assert.equal(v.checklistId,'people-practices');assert.equal(v.pbo,'29779');assert.equal(h.state().view,'consent');
 assert.equal(h.state().visitPreparations.length,0);
});
test('food starts with critical section without rewriting original question identifiers',()=>{
 const h=app();h.click('choose-visit-type',{id:'food-safety'});h.click('select-pbo',{id:'29779'});h.click('start');h.click('agree');
 assert.match(h.screen(),/Критические/);
 assert.doesNotMatch(h.screen(),/data-question="10.FS"/);
 h.click('sections');assert.ok(h.html('#sheet').indexOf('Критические')<h.html('#sheet').indexOf('Гигиена'));
});
test('food can finish without falsification and becomes immutable after confirmation',async()=>{
 const h=app({workspace:true,visit:{checklistId:'food-safety',falsification:'Да',falsificationConfirmed:false}});
 h.click('confirm');assert.doesNotMatch(h.html('#sheet'),/Есть факт фальсификации/);
 h.click('finish');await tick();const v=h.state().visits.find(v=>v.id===h.state().active);
 assert.equal(v.done,true);const before=v.answers;
 h.change({dataset:{answer:'10.FS'},value:'Нет'});assert.deepEqual(h.state().visits.find(x=>x.id===v.id)?.answers,before);
 h.click('pdf');assert.equal(h.reports.at(-1).falsification,undefined);
});
test('people uses the five supplied demo questions and requires its own falsification choice',async()=>{
 const h=app({workspace:true});h.click('choose-visit-type',{id:'people-practices'});h.click('select-pbo',{id:'29779'});h.click('start');h.click('agree');
 assert.match(h.screen(),/0 \/ 5/);assert.match(h.screen(),/Рассчитаны стаффинги/);
 for(let i=1;i<=5;i++)h.change({dataset:{answer:'p_q'+i},value:'Да'});
 h.click('nav',{view:'review'});h.click('confirm');assert.match(h.html('#sheet'),/Есть факт фальсификации/);
 h.click('finish');await tick();assert.equal(h.state().visits.find(v=>v.id===h.state().active).done,false);
 h.change({dataset:{},name:'falsification',value:'Нет'});h.click('finish');await tick();
 assert.equal(h.state().visits.find(v=>v.id===h.state().active).done,true);
 h.click('pdf');assert.equal(h.reports.at(-1).questions.length,5);assert.equal(h.reports.at(-1).falsification,'Нет');
});
test('after-answer mode is saved while manual mode leaves the question open',()=>{
 const h=app();h.click('answer-mode',{mode:'collapse'});assert.equal(h.state().answerMode,'collapse');
 const next=app({storage:h.storage});assert.equal(next.state().answerMode,'collapse');
 next.click('answer-mode',{mode:'manual'});assert.equal(next.state().answerMode,'manual');
});

test('preview precedes answer cards and warns below 80 once noncritical answers are complete',()=>{
 const h=app({visit:{checklistId:'people-practices',answers:{p_q1:'Нет',p_q2:'Нет',p_q3:'Нет',p_q4:'Да',p_q5:'Да'}}});
 h.click('nav',{view:'form'});const html=h.screen();
 assert.ok(html.indexOf('Предварительный результат')<html.indexOf('data-question='));
 assert.match(html,/focus-preview is-failed/);assert.match(html,/Ниже 80%/);
});

test('resuming a draft restores its own checklist and PBO in the entry form',()=>{
 const h=app({visit:{pbo:'29779',date:'2026-10-12',answers:{'10.FS':'Да'}}});
 h.click('choose-visit-type',{id:'people-practices'});h.click('select-pbo',{id:'26511'});
 h.click('open-visit',{id:'user-draft'});h.click('pause');
 assert.equal(h.state().visitSetup.pbo,'29779');assert.equal(h.state().visitSetup.checklistId,'food-safety');
});

test('a full assigned audit starts at critical questions while partial scope retains its original IDs',async()=>{
 const h=app({workspace:true});h.work('start-assignment','assignment-main');await tick();h.click('agree');
 assert.match(h.screen(),/Критические/);assert.doesNotMatch(h.screen(),/data-question="10.FS"/);
 h.click('next-section');assert.match(h.screen(),/data-question="10.FS"/);
});

test('home resume clears old history filters when more than one draft exists',()=>{
 const h=app({workspace:true,visit:{answers:{'10.FS':'Да'}}});
 h.click('choose-visit-type',{id:'people-practices'});h.click('select-pbo',{id:'29779'});h.click('start');
 h.input({id:'visit-query',value:'несуществующий',dataset:{}});
 h.click('nav',{view:'dashboard'});h.click('focus-cta');
 assert.equal(h.state().query,'');assert.equal(h.state().periodFrom,'');assert.equal(h.state().periodTo,'');
 assert.match(h.screen(),/Аудит безопасности пищи/);assert.match(h.screen(),/Практика работы с людьми/);
});
