const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const KEY='pusk:enterprise-audit:v1';
const js=name=>fs.readFileSync(path.join(__dirname,'..','js',name),'utf8');

// Run the real application and its event handlers. The DOM is deliberately small:
// these checks cover persistence/lifecycle and report data, not layout or PDF rendering.
function app({storage=new Map(),visit}={}){
  const events=new Map(),windowEvents=new Map(),elements=new Map(),timers=new Map(),reports=[];
  let timerId=0,reloads=0;
  const on=(events,name,listener)=>events.set(name,[...(events.get(name)||[]),listener]);
  const emit=(events,name,event={})=>{for(const listener of events.get(name)||[])listener(event);};
  const element=()=>({hidden:true,dataset:{},classList:{toggle(){}},replaceChildren(){},focus(){},querySelectorAll(){return [];},innerHTML:'',clientWidth:390});
  const document={baseURI:'http://localhost/',hidden:false,fonts:{ready:Promise.resolve()},querySelector(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector);},querySelectorAll(){return [];},addEventListener:(name,listener)=>on(events,name,listener)};
  const ctx={console,Date,URL,Blob,Uint8Array,devicePixelRatio:1,document,crypto:{randomUUID:()=> 'new-visit'},MutationObserver:class{observe(){}},confirm:()=>true,fetch:()=>new Promise(()=>{}),requestAnimationFrame:fn=>fn(),setTimeout(fn){timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}};
  ctx.window=ctx;
  ctx.addEventListener=(name,listener)=>on(windowEvents,name,listener);
  ctx.pdfjsLib={GlobalWorkerOptions:{}};
  ctx.PuskReportPdf={create(data){reports.push(data);return new Promise(()=>{});}};
  ctx.PuskVisitUX=require('../js/visit-ux.js');
  ctx.location={reload(){reloads++;emit(windowEvents,'pagehide');document.hidden=true;emit(events,'visibilitychange');}};
  vm.createContext(ctx);
  vm.runInContext(js('questions.js'),ctx);
  if(visit){
    const questions=ctx.PUSK_QUESTIONS.flatMap(c=>c.sections.flatMap(s=>s.questions));
    const v={id:'user-draft',pbo:'29779',date:'2026-10-12',agreed:true,done:false,section:0,answers:Object.fromEntries(questions.map(q=>[q.id,'Да'])),reasons:{},comments:{},photos:{},...visit};
    storage.set(KEY,JSON.stringify({version:1,pbo:v.pbo,date:v.date,view:v.done?'result':'review',active:v.id,visits:[v]}));
  }
  vm.runInContext(js('app.js'),ctx);
  return {storage,reports,get reloads(){return reloads;},state:()=>JSON.parse(storage.get(KEY)),click(action,extra={}){emit(events,'click',{target:{closest:()=>({dataset:{action,...extra}})}});},input(target){emit(events,'input',{target});},change(target){emit(events,'change',{target});},pagehide:()=>emit(windowEvents,'pagehide'),hidden(){document.hidden=true;emit(events,'visibilitychange');},pendingScrollSave(){emit(events,'scroll',{target:{id:'form-scroll'}});},flushTimers(){const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn());}};
}

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
