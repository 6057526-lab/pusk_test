const {test}=require('node:test');const assert=require('node:assert/strict');const {app,KEY}=require('./helpers/app-harness.cjs');
const choose=(h,id,value)=>h.change({dataset:{reason:id},closest:()=>({querySelectorAll:()=>[{value}]})});

test('No requires a supplied reason before review and preliminary PDF',()=>{
 const h=app({visit:{}});h.click('nav',{view:'form'});h.change({dataset:{answer:'10.FS'},value:'Нет'});h.click('nav',{view:'review'});
 assert.equal(h.state().view,'form');assert.match(h.html('#form-validation'),/Без причины: 1/);
 h.click('pdf');assert.equal(h.reports.length,0);
 choose(h,'10.FS','Не течет вода (по любой причине)');h.click('nav',{view:'review'});assert.equal(h.state().view,'review');
 h.click('pdf');assert.deepEqual(Array.from(h.reports.at(-1).questions.find(q=>q.id==='10.FS').reasons),['Не течет вода (по любой причине)']);
});

test('comment is the required free cause and whitespace cannot satisfy it',()=>{
 const h=app({visit:{}});h.click('nav',{view:'form'});h.change({dataset:{answer:'1.FS.Критический'},value:'Нет'});
 h.input({dataset:{comment:'1.FS.Критический'},value:'  '});h.click('nav',{view:'review'});assert.equal(h.state().view,'form');
 h.input({dataset:{comment:'1.FS.Критический'},value:'Указана причина'});h.click('nav',{view:'review'});assert.equal(h.state().view,'review');
 h.click('pdf');const q=h.reports.at(-1).questions.find(q=>q.id==='1.FS.Критический');assert.deepEqual(Array.from(q.reasons),[]);assert.equal(q.comment,'Указана причина');
});

test('Other needs an explanation and the reason reaches the report',()=>{
 const h=app({visit:{}});h.click('nav',{view:'form'});h.change({dataset:{answer:'10.FS'},value:'Нет'});choose(h,'10.FS','Другое');
 h.click('nav',{view:'review'});assert.equal(h.state().view,'form');
 h.input({dataset:{comment:'10.FS'},value:'Причина вне готового списка'});h.click('nav',{view:'review'});h.click('pdf');
 const q=h.reports.at(-1).questions.find(q=>q.id==='10.FS');assert.deepEqual(Array.from(q.reasons),['Другое']);assert.equal(q.comment,'Причина вне готового списка');
});

test('old free explanations remain available without duplicated report text',()=>{
 const original=app({visit:{}}),state=original.state(),v=state.visits[0];v.answers['1.FS.Критический']='Нет';v.comments['1.FS.Критический']='Старое пояснение';delete v.reasonTexts;
 original.storage.set(KEY,JSON.stringify(state));const h=app({storage:original.storage});
 assert.equal(h.state().visits[0].comments['1.FS.Критический'],'Старое пояснение');h.click('pdf');
 const q=h.reports.at(-1).questions.find(q=>q.id==='1.FS.Критический');assert.deepEqual(Array.from(q.reasons),[]);assert.equal(q.comment,'Старое пояснение');
});

test('previous separate cause and comment survive merging and a second reload',()=>{
 const original=app({visit:{}}),state=original.state(),v=state.visits[0];v.answers['1.FS.Критический']='Нет';
 v.reasonTexts={'1.FS.Критический':'Старая причина'};v.comments['1.FS.Критический']='Дополнительное пояснение';delete v.commentReasonMigration;
 original.storage.set(KEY,JSON.stringify(state));const once=app({storage:original.storage}),twice=app({storage:once.storage});
 assert.equal(twice.state().visits[0].comments['1.FS.Критический'],'Старая причина\nДополнительное пояснение');
});

test('confirmation shows visit identity and result without a second PDF action',()=>{
 const h=app({visit:{pbo:'26051',date:'2026-10-14'}});h.click('confirm');const html=h.html('#sheet');
 assert.match(html,/Батайск Парк/);assert.match(html,/Аудит безопасности пищи/);assert.match(html,/Удовлетворительный результат/);assert.match(html,/100%/);
 assert.doesNotMatch(html,/Предварительный PDF|data-action="confirm-pdf"/);
});
