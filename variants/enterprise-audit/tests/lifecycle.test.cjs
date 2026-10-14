const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const {app,KEY}=require('./helpers/app-harness.cjs');

test('dashboard search and scroll survive opening a result and restarting',()=>{
  const harness=app({visit:{done:true,falsification:'Нет'}});
  harness.click('nav',{view:'dashboard'});
  harness.input({id:'dashboard-query',value:'Озёрная'});
  harness.scrollDashboard(640);
  harness.click('dashboard-visit',{id:'user-draft'});
  assert.equal(harness.state().view,'result');assert.equal(harness.state().dashboardReturn,true);
  harness.click('dashboard-return');
  assert.equal(harness.state().view,'dashboard');assert.equal(harness.state().dashboardReturn,false);
  assert.equal(harness.state().dashboard.query,'Озёрная');assert.equal(harness.state().dashboard.scroll,640);
  const restarted=app({storage:harness.storage});
  assert.equal(restarted.state().dashboard.query,'Озёрная');assert.equal(restarted.state().dashboard.scroll,640);
});

test('dashboard opens the existing draft without changing answers or neighbors',()=>{
  const storage=new Map([['pusk:question-pager:v1','neighbor']]);
  const harness=app({storage,visit:{done:false,falsification:'Нет'}}),before=harness.state().visits[0].answers;
  harness.click('nav',{view:'dashboard'});harness.click('dashboard-visit',{id:'user-draft'});
  assert.equal(harness.state().view,'form');assert.deepEqual(harness.state().visits[0].answers,before);
  assert.equal(storage.get('pusk:question-pager:v1'),'neighbor');
});

test('dashboard completed-result drill-down excludes the uncounted example',()=>{
  const harness=app();harness.click('dashboard-results');
  assert.equal(harness.state().view,'visits');
  // Inspect the actual renderer without requiring browser storage mutation.
  assert.equal(harness.screen().includes('Демонстрационный пример'),false);
  assert.equal(harness.screen().includes('По выбранным условиям визитов нет'),true);
});

test('app reset cannot recreate deleted drafts during reload or delayed saves',()=>{
  const storage=new Map([['pusk:question-pager:v1','neighbor-draft']]);
  const harness=app({storage,visit:{falsification:'Нет'}});
  harness.pendingScrollSave();
  harness.click('reset');
  harness.flushTimers();
  assert.equal(harness.reloads,1);
  assert.equal(storage.has(KEY),false);
  assert.equal(storage.get('pusk:question-pager:v1'),'neighbor-draft');
});

test('shell reset remains deleted through iframe pagehide and pending saves',()=>{
  const harness=app({visit:{falsification:'Нет'}});
  harness.pendingScrollSave();
  harness.storage.delete(KEY);
  harness.pagehide();
  harness.hidden();
  harness.flushTimers();
  assert.equal(harness.storage.has(KEY),false);
});

test('ordinary edits persist through pagehide and application restart',()=>{
  const harness=app({visit:{falsification:'Нет'}});
  harness.input({dataset:{comment:'10.FS'},value:'Сохранённый комментарий'});
  harness.pagehide();
  assert.equal(harness.state().visits[0].comments['10.FS'],'Сохранённый комментарий');
  const restarted=app({storage:harness.storage});
  assert.equal(restarted.state().visits[0].comments['10.FS'],'Сохранённый комментарий');
  const fresh=app();
  assert.equal(fresh.storage.has(KEY),true);
});

test('unconfirmed legacy default is absent from preliminary PDF report data',()=>{
  const harness=app({visit:{falsification:'Нет'}});
  harness.click('download-pdf');
  assert.equal(harness.reports.length,1);
  assert.equal(harness.reports[0].preliminary,true);
  assert.equal(harness.reports[0].falsification,'Не выбран');
  assert.equal(harness.state().visits[0].falsification,'Нет');
});

test('explicit falsification choice and completed legacy results stay in reports',()=>{
  const harness=app({visit:{falsification:'Нет'}});
  harness.change({dataset:{},name:'falsification',value:'Да'});
  harness.click('download-pdf');
  assert.equal(harness.reports[0].falsification,'Да');
  assert.equal(harness.state().visits[0].falsificationConfirmed,true);
  const completed=app({visit:{done:true,falsification:'Нет'}});
  completed.click('download-pdf');
  assert.equal(completed.reports[0].preliminary,false);
  assert.equal(completed.reports[0].falsification,'Нет');
});
