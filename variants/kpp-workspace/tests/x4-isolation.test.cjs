const {test}=require('node:test');
const assert=require('node:assert/strict');
const {app,KEY}=require('./helpers/app-harness.cjs');

test('X4 starts separately and saving or resetting never changes the preserved X3 key',()=>{
  const oldKey='pusk:enterprise-audit:v1';
  const saved=JSON.stringify({version:1,pbo:'26511',date:'2026-10-12',view:'enterprise',visits:[{id:'old-x3',pbo:'26511',date:'2026-10-12',agreed:true,done:false,answers:{'10.FS':'Нет'},comments:{'10.FS':'Сохранить ответ X3'},reasons:{},photos:{}}]});
  const storage=new Map([[oldKey,saved],['pusk:question-pager:v1','old-x2']]);
  const h=app({storage});
  assert.equal(KEY,'pusk:kpp-workspace:v1');
  assert.equal(h.state().visits.some(v=>v.id==='old-x3'),false);
  h.click('nav',{view:'enterprise'});h.click('start');
  assert.equal(h.state().visits.some(v=>v.id===h.state().active),true);
  assert.equal(storage.get(oldKey),saved);
  h.click('reset');h.pagehide();h.flushTimers();
  assert.equal(storage.has(KEY),false);
  assert.equal(storage.get(oldKey),saved);
  assert.equal(storage.get('pusk:question-pager:v1'),'old-x2');
});
