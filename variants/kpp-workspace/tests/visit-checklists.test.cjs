const {test}=require('node:test');
const assert=require('node:assert/strict');
const {app,KEY}=require('./helpers/app-harness.cjs');

test('new visit opens a searchable checklist choice without creating a visit',()=>{
  const h=app();h.click('nav',{view:'enterprise'});const before=h.state().visits;
  h.click('checklist-picker');
  assert.match(h.html('#sheet'),/data-action="select-checklist"/);
  assert.match(h.html('#sheet'),/Практика работы с людьми/);
  h.input({id:'checklist-query',value:'практики'});
  assert.match(h.html('#checklist-options'),/people-practices/);
  assert.doesNotMatch(h.html('#checklist-options'),/data-id="food-safety"/);
  assert.deepEqual(h.state().visits,before);
});

test('another checklist creates its own draft and preserves same-day food answers and neighbor storage',()=>{
  const h=app({visit:{date:'2026-10-13',answers:{'10.FS':'Нет'}}});h.storage.set('pusk:question-pager:v1','neighbor');
  h.click('nav',{view:'enterprise'});const before=h.state().visits.find(v=>v.id==='user-draft');
  h.click('select-checklist',{id:'people-practices'});h.click('start');
  const id=h.state().active;assert.equal(h.state().visits.find(v=>v.id===id).checklistId,'people-practices');
  assert.deepEqual(h.state().visits.find(v=>v.id==='user-draft'),before);
  h.click('start');assert.equal(h.state().visits.length,2);assert.equal(h.storage.get('pusk:question-pager:v1'),'neighbor');
  const r=app({storage:h.storage});r.click('select-checklist',{id:'food-safety'});r.click('start');
  assert.equal(r.state().active,'user-draft');assert.deepEqual(r.state().visits.find(v=>v.id==='user-draft'),before);
});

test('new food visit stores checklist identity and restores it when opening after choosing another type',()=>{
  const h=app();h.click('nav',{view:'enterprise'});h.click('start');
  const v=h.state().visits.find(v=>v.id===h.state().active);assert.equal(v.checklistId,'food-safety');
  h.click('nav',{view:'enterprise'});h.click('select-checklist',{id:'high-level'});h.click('open-visit',{id:v.id});
  assert.equal(h.state().checklistId,'food-safety');assert.equal(h.state().active,v.id);
});

test('foreign or unknown questionnaires cannot reopen as a food audit or match its draft',()=>{
  const storage=new Map([[KEY,JSON.stringify({version:1,pbo:'29779',date:'2026-10-13',view:'enterprise',active:null,visits:[{id:'foreign',checklistId:'unknown-questionnaire',pbo:'29779',date:'2026-10-13',done:false,agreed:true,answers:{other:'Да'},comments:{},reasons:{},photos:{}}]})]]);
  const h=app({storage});h.click('open-visit',{id:'foreign'});
  assert.equal(h.state().view,'enterprise');assert.equal(h.state().active,null);
  h.click('start');assert.notEqual(h.state().active,'foreign');
  assert.equal(h.state().visits.find(v=>v.id==='foreign').answers.other,'Да');
  h.click('nav',{view:'enterprise'});h.click('select-checklist',{id:'unknown'});assert.equal(h.state().checklistId,'food-safety');
});

test('historic preparations remain in storage when the current catalogue becomes two runnable checklists',()=>{
  const records=[{id:'prep1',pbo:'29779',date:'2026-10-13',checklistId:'people-practices'},{id:'prep2',pbo:'26511',date:'2026-10-14',checklistId:'business-planning'}];
  const storage=new Map([[KEY,JSON.stringify({version:1,pbo:'29779',date:'2026-10-13',view:'dashboard',active:null,visits:[],visitPreparations:records})]]);
  const h=app({storage});assert.deepEqual(h.state().visitPreparations,records);
});

test('assigned visit ignores the free launch selection and keeps its own food scope',async()=>{
  const h=app({workspace:true});h.click('nav',{view:'enterprise'});h.click('select-checklist',{id:'people-practices'});
  h.work('start-assignment','assignment-repeat');await new Promise(r=>setImmediate(r));
  const v=h.state().visits.find(v=>v.id===h.state().active);
  assert.equal(v.checklistId,'food-safety');assert.equal(v.questionIds.length,13);assert.equal(h.state().checklistId,'food-safety');
  assert.equal(h.state().visitPreparations.length,0);
});

test('failed preparation storage never claims successful saving',()=>{
  const h=app();h.click('nav',{view:'enterprise'});h.click('select-checklist',{id:'people-practices'});
  h.storage.set=()=>{throw Error('quota');};h.click('start');
  assert.doesNotMatch(h.html('#sheet'),/Подготовка сохранена/);
  assert.match(h.text('#notice'),/Не удалось сохранить/);
});
