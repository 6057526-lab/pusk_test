(function(root){'use strict';
 const S=typeof module==='object'&&module.exports?require('./workspace-seed.js'):root.PuskWorkspaceSeed;
 const H=typeof module==='object'&&module.exports?require('./workspace-handoffs.js'):root.PuskWorkspaceHandoffs;
 const clone=x=>JSON.parse(JSON.stringify(x));
 const error=(code,message)=>Object.assign(new Error(message),{code});
 function ensureActualityTasks(w){
 for(const p of w.plans){
  let t=w.tasks.find(t=>t.type==='update_plan'&&t.planId===p.id);
  const needs=p.status==='approved'&&!planAge(w,p).actual;
  if(needs&&!t){t={id:'actualize-'+p.id,type:'update_plan',planId:p.id,siteId:p.siteId,title:'Актуализировать план действий',status:'waiting',assignee:'Директор ПБО (демо)',due:null,revision:0};w.tasks.push(t);}
  if(t&&((needs&&t.status!=='waiting')||(!needs&&t.status!=='completed'))){t.status=needs?'waiting':'completed';t.revision++;}
 }
 const a=w.actions.find(a=>a.id==='action-29779-1');if(a&&!a.sourceVisitId)a.sourceVisitId='workflow-source-29779';
 return w;
 }
 function createWorkspace(options){return H.ensure(ensureActualityTasks(S.seed(options)));}
 function migrateWorkspace(w,options){if(w?.version===1&&['sites','plans','planVersions','actions','assignments','tasks','processes','events','commands','programItems'].every(k=>Array.isArray(w[k])))return H.ensure(ensureActualityTasks(clone(w)));if(w)throw error('invalid_data','Не удалось прочитать данные рабочего пространства. Исходные данные сохранены.');return createWorkspace(options);}
 function entity(w,id){return [...w.plans,...w.actions,...w.tasks,...w.assignments,...w.processes,...w.sites].find(e=>e.id===id);}
 function planAge(w,p){const days=Math.floor((new Date(w.settings.today+'T12:00:00')-new Date(p.updatedAt+'T12:00:00'))/86400000),active=w.actions.filter(a=>a.planId===p.id&&!a.archived&&!['verified'].includes(a.status)&&a.due>=w.settings.today);return {days,actual:days<=w.settings.planAgeDays&&active.length>0,reason:days>w.settings.planAgeDays?'Истёк срок обновления в примере':!active.length?'Нет активных действий с будущим сроком':'Актуален по условиям примера'};}
 function selectPlan(w,id){const p=w.plans.find(p=>p.id===id);return p?{...p,version:w.planVersions.find(v=>v.id===p.versionId),versions:w.planVersions.filter(v=>v.planId===p.id),actions:w.actions.filter(a=>a.planId===p.id&&!a.archived),actuality:planAge(w,p)}:null;}
 function selectProgram(w,siteId){const rows=w.programItems.filter(p=>(!siteId||p.siteId===siteId)&&w.sites.find(s=>s.id===p.siteId)?.kppId===w.settings.currentKppId);return {rows,total:rows.length,completed:rows.filter(p=>p.status==='completed').length};}
 function selectQueue(w,visits=[],{siteId='',status='open',query=''}={}){
  const needle=query.trim().toLocaleLowerCase('ru');
  const tasks=w.tasks.map(t=>({...t,kind:t.type,source:'demo',site:w.sites.find(s=>s.id===t.siteId)}));
  const linked=new Set(w.assignments.filter(a=>a.visitId).map(a=>a.visitId));
  const drafts=visits.filter(v=>!v.done&&!v.example&&!linked.has(v.id)).map(v=>({id:v.id,visitId:v.id,siteId:v.pbo,kind:'draft',status:'open',title:'Продолжить аудит',due:null,site:w.sites.find(s=>s.id===v.pbo),answers:Object.keys(v.answers||{}).length,assigneeId:w.sites.find(s=>s.id===v.pbo)?.kppId||w.settings.currentKppId,source:'local'}));
  return [...tasks,...drafts].filter(t=>(!siteId||t.siteId===siteId)&&(['open','overdue'].includes(status)&&!H.owns(w,t)?false:status==='all'||status==='overdue'?status==='all'||t.status==='open'&&t.due&&t.due<w.settings.today:t.status===status)&&(!needle||(t.title+' '+t.siteId+' '+(t.site?.name||'')).toLocaleLowerCase('ru').includes(needle))).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999'));
 }
 function applyCommand(current,c,{actor='kpp-demo',now='2026-10-13T12:00:00Z'}={}){
  if(!c?.id||!c.type||!c.entityId)throw error('validation','Неполная команда.');
  if(current.commands.includes(c.id))return {workspace:clone(current),result:{duplicate:true}};
  const w=clone(current),e=entity(w,c.entityId)||(c.type==='complete_local_visit'&&c.payload?.siteId?{id:c.entityId,siteId:c.payload.siteId,revision:0}:null);if(!e)throw error('not_found','Запись не найдена.');
  if(c.expectedRevision!==e.revision)throw error('conflict','Запись изменилась. Обновите её перед решением.');
  const p=c.payload||{},demo=c.type.startsWith('demo_');H.guard(w,c,e);let text='';
  if(!demo&&actor!=='kpp-demo')throw error('forbidden','Нет права на это действие.');
  const handoffText=H.apply(w,c,e,now);if(handoffText){text=handoffText;}else if(['approve_plan','return_plan'].includes(c.type)){
   if(e.status!=='submitted'||!e.versionId)throw error('validation','Решение доступно только по текущему отправленному плану.');
   if(c.type==='return_plan'&&!p.comment?.trim())throw error('validation','Укажите, что нужно доработать.');
   const version=w.planVersions.find(v=>v.id===e.versionId);if(p.versionId&&p.versionId!==version.id)throw error('conflict','Выбрана старая версия плана.');
   e.status=c.type==='approve_plan'?'approved':'returned';version.decision=e.status;version.decidedAt=now;version.comment=p.comment?.trim()||'';
   if(e.status==='approved')e.approvedAt=now.slice(0,10);
   const task=w.tasks.find(t=>t.planId===e.id&&t.type==='approval');if(task){task.status=e.status==='approved'?'completed':'waiting';task.assignee=e.status==='approved'?'КпП (демо)':'Директор ПБО (демо)';task.assigneeId=e.status==='approved'?w.sites.find(s=>s.id===e.siteId).kppId:'director-'+e.siteId;task.revision++;}
   text=e.status==='approved'?'КпП согласовал план. Исполнение действий показано отдельно.':'КпП вернул план директору: '+version.comment;
  }else if(c.type==='demo_resubmit'){
   if(!['returned','approved','draft'].includes(e.status))throw error('validation','План уже ожидает решения.');
   const versions=w.planVersions.filter(v=>v.planId===e.id),number=Math.max(...versions.map(v=>v.number))+1;
   const version={id:e.id+'-version-'+number,planId:e.id,number,submittedAt:now.slice(0,10),decision:null,comment:'',items:w.actions.filter(a=>a.planId===e.id&&!a.archived).map(a=>({...a,due:p.due||a.due}))};
   for(const a of w.actions.filter(a=>a.planId===e.id&&!a.archived))if(p.due){a.due=p.due;a.revision++;}
   w.planVersions.push(version);e.versionId=version.id;e.status='submitted';e.updatedAt=now.slice(0,10);
   let task=w.tasks.find(t=>t.planId===e.id&&t.type==='approval');if(task){task.status='open';task.assignee='КпП (демо)';task.assigneeId=w.sites.find(s=>s.id===e.siteId).kppId;task.revision++;}
   text='Директор (демо) отправил новую версию '+number+' на согласование.';
  }else if(c.type==='demo_report'||c.type==='demo_verify'||c.type==='demo_rework'){
   if(!e.planId||!w.actions.some(a=>a.id===e.id))throw error('validation','Не выбрано действие.');
   if(!p.comment?.trim())throw error('validation','Добавьте пояснение к демонстрационному событию.');
   if(c.type==='demo_verify'&&e.status!=='reported_done')throw error('validation','Сначала исполнитель сообщает о выполнении.');
   if(c.type==='demo_rework'&&!['reported_done','verified'].includes(e.status))throw error('validation','Нет результата для возврата.');
   if(e.archived)throw error('validation','Это действие предыдущей версии доступно только для просмотра.');
   if(p.evidence!==undefined){if(!Array.isArray(p.evidence)||p.evidence.length>3||p.evidence.some(f=>typeof f.url!=='string'||!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(f.url)||f.url.length>4200000))throw error('validation','Формат подтверждения: PNG или JPEG до 3 МБ.');e.evidence=clone(p.evidence);}
   e.status=c.type==='demo_report'?'reported_done':c.type==='demo_verify'?'verified':'rework';e.comment=p.comment.trim();e.reportedAt=now;
   text=(c.type==='demo_report'?'Исполнитель':c.type==='demo_verify'?'Проверяющий (роль требует согласования)':'Проверяющий')+' (демо): '+e.comment;
  }else if(c.type==='link_assignment'){
   if(!w.assignments.some(a=>a.id===e.id)||e.status!=='open'||!p.visitId)throw error('validation','Назначение недоступно.');
   if(e.visitId&&e.visitId!==p.visitId)throw error('conflict','У назначения уже есть черновик.');
   e.visitId=p.visitId;e.visitInitiatorId=w.settings.currentKppId;text='Открыт визит по назначению примера.';
  }else if(c.type==='complete_assignment'){
   if(!w.assignments.some(a=>a.id===e.id)||e.status!=='open'||!p.visitId||e.visitId&&e.visitId!==p.visitId)throw error('validation','Назначение не соответствует визиту.');
   e.visitId=p.visitId;e.status='completed';e.success=!!p.success;e.completedAt=now;
   const task=w.tasks.find(t=>t.assignmentId===e.id);if(task){task.status='completed';task.revision++;}
   const item=w.programItems.find(x=>x.assignmentId===e.id);if(item)item.status='completed';
   w.tasks.push({id:'ack-'+p.visitId,siteId:e.siteId,visitId:p.visitId,type:'acknowledge',title:'Ознакомиться с результатами',status:'open',due:null,assignee:H.person(w,w.settings.currentKppId),assigneeId:w.settings.currentKppId,revision:0});
   if(e.processId){const process=w.processes.find(x=>x.id===e.processId);if(process&&process.stage===e.stage){
    if(p.success&&e.stage==='control'){process.stage='released';process.releasedAt=now.slice(0,10);}
    else{process.stage=p.success?'control':e.stage;const id=e.id+'-next-'+(process.revision+1);const next={...e,id,stage:process.stage,kind:process.stage,title:process.stage==='control'?'Контрольная проверка · ИПУР':'Повтор поддерживающей проверки · ИПУР',status:'open',visitId:null,revision:0,success:null,completedAt:null};w.assignments.push(next);w.tasks.push({id:'task-'+id,siteId:e.siteId,assignmentId:id,type:'assignment',title:next.title,status:'open',due:next.due,assignee:'КпП (демо)',revision:0});w.programItems.push({id:'program-'+id,siteId:e.siteId,assignmentId:id,title:next.title,status:'open',source:'demo'});}
    process.revision++;
   }}
   text='Назначенная проверка завершена. '+(p.success?'Результат удовлетворительный.':'Результат неудовлетворительный.');
  }else if(c.type==='complete_local_visit'){
   if(!w.sites.some(s=>s.id===e.siteId))throw error('validation','Предприятие не входит в демонстрационный портфель.');
   if(!w.tasks.some(t=>t.id==='ack-'+e.id))w.tasks.push({id:'ack-'+e.id,siteId:e.siteId,visitId:e.id,type:'acknowledge',title:'Ознакомиться с результатами',status:'open',due:null,assignee:H.person(w,w.settings.currentKppId),assigneeId:w.settings.currentKppId,revision:0});
   text='Аудит завершён; ознакомление с результатами ожидает отдельного подтверждения.';
  }else if(c.type==='acknowledge'){
   if(e.type!=='acknowledge'||e.status!=='open')throw error('validation','Ознакомление уже завершено или недоступно.');
   e.status='completed';text='КпП подтвердил ознакомление с результатами.';
  }else throw error('forbidden','Это действие недоступно КпП.');
  H.ensure(ensureActualityTasks(w));e.revision++;w.revision++;w.commands.push(c.id);
  w.events.unshift({id:c.id,entityId:e.id,planId:e.planId||e.versionId&&e.id||null,siteId:e.siteId,type:c.type,actorId:demo?'demo:'+c.type:w.settings.currentKppId,actor:demo?'Участник демонстрационного процесса':H.person(w,w.settings.currentKppId),at:now,text});
  return {workspace:w,result:{entityId:e.id}};
 }
 function analyzeVisits(visits,sections,{siteId='',from='',to=''}={}){
  const questions=sections.flatMap(s=>s.questions),ids=new Set(questions.map(q=>q.id));
  const records=visits.filter(v=>(!v.checklistId||v.checklistId==='food-safety')&&v.done&&!v.example&&(!siteId||v.pbo===siteId)&&(!from||v.date>=from)&&(!to||v.date<=to));
  const full=records.filter(v=>!v.questionIds||v.questionIds.length===ids.size&&v.questionIds.every(id=>ids.has(id)));
  const sorted=full.slice().sort((a,b)=>b.date.localeCompare(a.date)||(b.completedAt||'').localeCompare(a.completedAt||''));
  const seen=new Set(),latest=sorted.filter(v=>!seen.has(v.pbo)&&seen.add(v.pbo));
  const issues=questions.map(q=>({id:q.id,question:q,siteIds:latest.filter(v=>v.answers[q.id]==='Нет').map(v=>v.pbo),visitIds:latest.filter(v=>v.answers[q.id]==='Нет').map(v=>v.id),totalSites:latest.length})).filter(q=>q.siteIds.length).sort((a,b)=>b.siteIds.length-a.siteIds.length);
  return {records,full,latest,issues};
 }
 const api={createWorkspace,migrateWorkspace,applyCommand,selectQueue,selectPlan,selectProgram,planAge,analyzeVisits};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.PuskWorkspaceDomain=api;
})(typeof window==='object'?window:globalThis);
