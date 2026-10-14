(function(root){'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x));
 const fail=(code,message)=>{throw Object.assign(new Error(message),{code});};
 const person=(w,id)=>w.people.find(p=>p.id===id)?.name||id;
 function ensure(w){
  w.people||=[{id:'kpp-demo',role:'kpp',name:'КпП · основной (демо)'},{id:'kpp-successor-demo',role:'kpp',name:'КпП · новый (демо)'},{id:'dl-demo',role:'dl',name:'DL · инициатор (демо)'},{id:'leader-demo',role:'leader',name:'Лидер проекта (демо)'}];
  w.settings.currentKppId||='kpp-demo';w.planTasks||=[];w.planDrafts||=[];w.referenceVisits||=[];
  for(const s of w.sites){s.revision??=0;s.kppId||='kpp-demo';}
  if(!w.settings.handoffVersion){
   const addAssignment=(id,siteId,title,extra)=>{if(!w.sites.some(s=>s.id===siteId)||w.assignments.some(a=>a.id===id))return;const a={id,siteId,title,kind:'repeat',status:'open',revision:0,due:'2026-10-20',sectionIndexes:[0],source:'demo',assigneeId:'kpp-demo',...extra};w.assignments.push(a);w.tasks.push({id:'task-'+id,siteId,assignmentId:id,type:'assignment',title,due:a.due,status:a.status,revision:0,assigneeId:a.assigneeId,assignee:person(w,a.assigneeId)});w.programItems.push({id:'program-'+id,siteId,assignmentId:id,title,status:a.status,source:'demo'});};
   addAssignment('assignment-dl-repeat','3333333','Повторная проверка после визита DL',{sourceInitiatorId:'dl-demo',sourceVisitId:'handoff-source-dl',scopeNote:'Демонстрация передачи DL → КпП. Повторный состав: 13 исходных вопросов гигиены.'});
   if(w.sites.some(s=>s.id==='3333333')){
    w.referenceVisits.push({id:'handoff-source-dl',siteId:'3333333',date:'2026-10-10',creatorId:'dl-demo',noQuestionIds:['10.FS','11.FS']});
    w.tasks.push({id:'ack-dl-source',siteId:'3333333',visitId:'handoff-source-dl',type:'acknowledge',title:'Ознакомление инициатора DL',status:'open',due:null,revision:0,assigneeId:'dl-demo',assignee:person(w,'dl-demo')});
    if(!w.plans.some(p=>p.id==='plan-handoff')){
     const id='plan-handoff',versionId=id+'-v1',siteId='3333333';const groups=[{id:'handoff-hygiene',planId:id,siteId,title:'Восстановить условия для гигиены',revision:0},{id:'handoff-monitoring',planId:id,siteId,title:'Закрепить контроль на смене',revision:0}];w.planTasks.push(...groups);
     const definitions=[['handoff-water','handoff-hygiene','Восстановить оборудование для мытья рук','10.FS'],['handoff-access','handoff-hygiene','Освободить доступ к раковине','11.FS'],['handoff-shift','handoff-monitoring','Проверить условия на следующей смене','10.FS']];
     const items=definitions.map(([aid,planTaskId,title,sourceQuestionId])=>({id:aid,planId:id,siteId,planTaskId,title,sourceQuestionId,sourceVisitId:'handoff-source-dl',due:'2026-10-25',assignee:'Исполнитель ПБО (демо)',status:'open',revision:0,comment:'',evidence:[]}));w.actions.push(...items);
     w.plans.push({id,siteId,title:'План действий · Test Hub',status:'submitted',versionId,revision:0,updatedAt:'2026-10-12',author:'Директор ПБО (демо)',source:'demo'});w.planVersions.push({id:versionId,planId:id,number:1,submittedAt:'2026-10-12',decision:null,comment:'',items:copy(items),tasks:copy(groups)});
     w.tasks.push({id:'approval-handoff',siteId,planId:id,type:'approval',title:'Согласовать план с задачами и действиями',status:'open',due:'2026-10-17',revision:0,assigneeId:'kpp-demo',assignee:person(w,'kpp-demo')});
    }
   }
   addAssignment('assignment-regulation','101113','Повторная проверка ожидает регламент',{status:'blocked',blockedReason:'Не настроен регламент повторного визита. Лидеру проекта передана задача восстановить настройку.',blockOwnerId:'leader-demo',scopeNote:'Демонстрация технической блокировки. После восстановления в примере назначаются 13 исходных вопросов гигиены.'});
   if(w.assignments.some(a=>a.id==='assignment-regulation'))w.tasks.push({id:'regulation-leader',siteId:'101113',assignmentId:'assignment-regulation',type:'configuration',title:'Восстановить регламент повторного',status:'waiting',due:null,revision:0,assigneeId:'leader-demo',assignee:person(w,'leader-demo')});
   w.settings.handoffVersion=1;
  }
  for(const p of w.plans){let groups=w.planTasks.filter(t=>t.planId===p.id);if(!groups.length){const t={id:'group-'+p.id,planId:p.id,siteId:p.siteId,title:'Работы по плану',revision:0};w.planTasks.push(t);groups=[t];}for(const a of w.actions.filter(a=>a.planId===p.id))a.planTaskId||=groups[0].id;for(const v of w.planVersions.filter(v=>v.planId===p.id)){v.tasks||=copy(groups);v.groupMap||=Object.fromEntries(v.items.map(a=>[a.id,a.planTaskId||groups[0].id]));}}
  for(const a of w.assignments){a.assigneeId||=w.sites.find(s=>s.id===a.siteId)?.kppId||'kpp-demo';}
  for(const t of w.tasks){if(!t.assigneeId)t.assigneeId=t.status==='waiting'?'director-'+t.siteId:w.sites.find(s=>s.id===t.siteId)?.kppId||'kpp-demo';}
  return w;
 }
 function owns(w,e){return !e.assigneeId||e.assigneeId===w.settings.currentKppId;}
 function guard(w,c,e){if(c.type.startsWith('demo_'))return;if(e.assigneeId&&!owns(w,e))fail('forbidden','Работа назначена другому участнику. Передача показана отдельно в демонстрации.');if(['approve_plan','return_plan','complete_local_visit'].includes(c.type)&&w.sites.find(s=>s.id===e.siteId)?.kppId!==w.settings.currentKppId)fail('forbidden','Предприятие закреплено за другим КпП в демонстрации.');}
 function apply(w,c,e,now){const p=c.payload||{};
  if(c.type==='demo_save_plan_draft'){
   if(!['returned','approved','draft'].includes(e.status))fail('validation','Сначала завершите согласование текущей версии.');
   const tasks=p.tasks||[],actions=p.actions||[],ids=new Set(tasks.map(t=>t.id));if(!tasks.length||tasks.some(t=>!t.id||!t.title?.trim())||ids.size!==tasks.length)fail('validation','Заполните уникальные задачи плана.');
   if(!actions.length||actions.some(a=>!a.id||!ids.has(a.planTaskId)||!a.title?.trim()||!a.assignee?.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(a.due))||new Set(actions.map(a=>a.id)).size!==actions.length)fail('validation','У каждого действия нужны задача плана, название, исполнитель и срок.');
   let draft=w.planDrafts.find(d=>d.planId===e.id);if(!draft){draft={planId:e.id};w.planDrafts.push(draft);}Object.assign(draft,{tasks:tasks.map(t=>({id:t.id,title:t.title.trim()})),actions:actions.map(a=>({...a,title:a.title.trim(),assignee:a.assignee.trim()})),savedAt:now});return 'Директор (демо) сохранил черновик новой версии. Текущая версия не изменена.';
  }
  if(c.type==='demo_submit_plan_draft'){
   if(!['returned','approved','draft'].includes(e.status))fail('validation','План уже ожидает решения.');const draft=w.planDrafts.find(d=>d.planId===e.id);if(!draft)fail('validation','Сначала сохраните черновик директора.');
   const number=Math.max(...w.planVersions.filter(v=>v.planId===e.id).map(v=>v.number))+1,versionId=e.id+'-version-'+number;
   const groups=draft.tasks.map(t=>({...t,planId:e.id,siteId:e.siteId,revision:0}));
   const items=draft.actions.map(a=>{const old=w.actions.find(x=>x.id===a.id&&x.planId===e.id&&!x.archived),unchanged=old&&old.title===a.title&&old.due===a.due&&old.assignee===a.assignee;return {...a,id:unchanged?old.id:versionId+'-'+a.id,planId:e.id,siteId:e.siteId,revision:unchanged?old.revision:0,status:unchanged?old.status:'open',comment:unchanged?old.comment:'',evidence:unchanged?copy(old.evidence||[]):[],archived:false};});
   for(const a of w.actions.filter(a=>a.planId===e.id))a.archived=true;
   for(const a of items){const old=w.actions.find(x=>x.id===a.id);if(old)Object.assign(old,a);else w.actions.push(a);}
   w.planTasks=w.planTasks.filter(t=>t.planId!==e.id).concat(groups);w.planVersions.push({id:versionId,planId:e.id,number,submittedAt:now.slice(0,10),decision:null,comment:'',items:copy(items),tasks:copy(groups)});e.versionId=versionId;e.status='submitted';e.updatedAt=now.slice(0,10);
   const task=w.tasks.find(t=>t.planId===e.id&&t.type==='approval');if(task){task.status='open';task.assigneeId=w.sites.find(s=>s.id===e.siteId).kppId;task.assignee=person(w,task.assigneeId);task.revision++;}w.planDrafts=w.planDrafts.filter(d=>d.planId!==e.id);return 'Директор (демо) передал новую версию '+number+' с задачами и действиями.';
  }
  if(c.type==='demo_restore_regulation'){
   if(e.status!=='blocked')fail('validation','Это назначение не ожидает восстановления.');if(!p.comment?.trim())fail('validation','Укажите, что восстановлено в примере.');e.status='open';e.title='Повторная проверка · гигиена';e.blockedReason='';e.restoredAt=now;const task=w.tasks.find(t=>t.id==='task-'+e.id);if(task){task.status='open';task.title=e.title;task.revision++;}const leader=w.tasks.find(t=>t.id==='regulation-leader');if(leader){leader.status='completed';leader.revision++;}const item=w.programItems.find(i=>i.assignmentId===e.id);if(item){item.status='open';item.title=e.title;}return 'Лидер (демо) восстановил регламент; то же назначение снова доступно. Способ восстановления реального процесса требует сверки.';
  }
  if(c.type==='demo_transfer_kpp'){
   if(!w.sites.includes(e)||!w.people.some(x=>x.id===p.personId&&x.role==='kpp'))fail('validation','Выберите КпП демонстрации.');if(e.kppId===p.personId)fail('validation','Предприятие уже закреплено за этим КпП.');if(!p.comment?.trim())fail('validation','Укажите основание передачи.');const old=e.kppId;e.kppId=p.personId;for(const a of w.assignments.filter(a=>a.siteId===e.id&&a.status!=='completed')){a.assigneeId=p.personId;a.revision++;}for(const t of w.tasks.filter(t=>t.siteId===e.id&&t.status!=='completed'&&t.assigneeId===old)){t.assigneeId=p.personId;t.assignee=person(w,p.personId);t.revision++;}return 'Закрепление (демо): '+person(w,old)+' → '+person(w,p.personId)+'. Открытая работа переназначена. Исторический автор сохранён. '+p.comment.trim();
  }
  if(c.type==='demo_view_as'){
   if(!w.people.some(x=>x.id===p.personId&&x.role==='kpp'))fail('validation','Неизвестный участник демонстрации.');w.settings.currentKppId=p.personId;return 'Демонстрация продолжена от участника: '+person(w,p.personId)+'. Это не вход в другую реальную учётную запись.';
  }
  return null;
 }
 const api={ensure,owns,guard,apply,person};if(typeof module==='object'&&module.exports)module.exports=api;else root.PuskWorkspaceHandoffs=api;
})(typeof window==='object'?window:globalThis);
