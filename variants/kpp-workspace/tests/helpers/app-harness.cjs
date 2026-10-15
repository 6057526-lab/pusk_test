const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const KEY='pusk:kpp-workspace:v1';
const js=name=>fs.readFileSync(path.join(__dirname,'..','..','js',name),'utf8');

// Run the real application and its event handlers. The DOM is deliberately small:
// these checks cover persistence/lifecycle and report data, not layout or PDF rendering.
function app({storage=new Map(),visit,workspace=false,questionCards=[]}={}){
  const events=new Map(),windowEvents=new Map(),elements=new Map(),timers=new Map(),reports=[];
  let timerId=0,reloads=0;
  const on=(events,name,listener)=>events.set(name,[...(events.get(name)||[]),listener]);
  const emit=(events,name,event={})=>{for(const listener of events.get(name)||[])listener(event);};
  const element=()=>({hidden:true,dataset:{},style:{},classList:{toggle(){}},replaceChildren(){},insertAdjacentHTML(){},focus(){},querySelectorAll(){return [];},getBoundingClientRect(){return {top:0,bottom:0};},innerHTML:'',clientWidth:390,scrollTop:0});
  const document={baseURI:'http://localhost/',hidden:false,fonts:{ready:Promise.resolve()},querySelector(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector);},querySelectorAll(selector){return selector==='[data-question]'?questionCards:[];},addEventListener:(name,listener)=>on(events,name,listener)};
  const ctx={console,Date,URL,Blob,Uint8Array,devicePixelRatio:1,document,crypto:{randomUUID:require('node:crypto').randomUUID},MutationObserver:class{observe(){}},confirm:()=>true,fetch:()=>new Promise(()=>{}),requestAnimationFrame:fn=>fn(),setTimeout(fn){timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}};
  ctx.window=ctx;
  ctx.addEventListener=(name,listener)=>on(windowEvents,name,listener);
  ctx.pdfjsLib={GlobalWorkerOptions:{}};
  ctx.PuskReportPdf={create(data){reports.push(data);return new Promise(()=>{});}};
  ctx.PuskVisitUX=require('../../js/visit-ux.js');
  ctx.PuskDashboard=require('../../js/dashboard-data.js');
  ctx.location={reload(){reloads++;emit(windowEvents,'pagehide');document.hidden=true;emit(events,'visibilitychange');}};
  vm.createContext(ctx);
  vm.runInContext(js('questions.js'),ctx);
  for(const name of ['people-questions.js','visit-entry-ui.js','visit-scope.js','visit-reasons.js'])if(fs.existsSync(path.join(__dirname,'..','..','js',name)))vm.runInContext(js(name),ctx);
  if(fs.existsSync(path.join(__dirname,'..','..','js','checklist-catalog.js')))vm.runInContext(js('checklist-catalog.js'),ctx);
  if(visit){
    const questions=ctx.PUSK_QUESTIONS.flatMap(c=>c.sections.flatMap(s=>s.questions));
    const v={id:'user-draft',pbo:'29779',date:'2026-10-12',agreed:true,done:false,section:0,answers:Object.fromEntries(questions.map(q=>[q.id,'Да'])),reasons:{},comments:{},photos:{},...visit};
    storage.set(KEY,JSON.stringify({version:1,pbo:v.pbo,date:v.date,view:v.done?'result':'review',active:v.id,visits:[v]}));
  }
  if(workspace){for(const name of ['visit-scope.js','workspace-seed.js','workspace-handoffs.js','workspace-domain.js','workspace-repository.js','workspace-demo-ui.js','workspace-ui.js'])vm.runInContext(js(name),ctx);}
  vm.runInContext(js('app.js'),ctx);
  return {storage,reports,html:selector=>elements.get(selector)?.innerHTML,text:selector=>elements.get(selector)?.textContent,work(action,id='',extra={}){emit(events,'click',{target:{closest:selector=>selector==='[data-work]'?{dataset:{work:action,id,...extra}}:null}});},get reloads(){return reloads;},state:()=>JSON.parse(storage.get(KEY)),screen:()=>document.querySelector('#screen').innerHTML,scrollDashboard(value){document.querySelector('#dashboard-scroll').scrollTop=value;},click(action,extra={}){emit(events,'click',{target:{closest:()=>({dataset:{action,...extra}})}});},input(target){emit(events,'input',{target});},change(target){emit(events,'change',{target});},pagehide:()=>emit(windowEvents,'pagehide'),hidden(){document.hidden=true;emit(events,'visibilitychange');},pendingScrollSave(){emit(events,'scroll',{target:{id:'form-scroll'}});},flushTimers(){const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn());}};
}


module.exports={app,KEY};
