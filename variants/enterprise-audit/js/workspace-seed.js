(function(root){'use strict';
function seed({sites=[],today='2026-10-13'}={}){
 const ids=sites.map(s=>s.id),has=id=>ids.includes(id);
 const w={version:1,revision:0,sites:sites.map(s=>({...s,assigned:true,source:'demo'})),plans:[],planVersions:[],actions:[],assignments:[],tasks:[],programItems:[],processes:[],events:[],commands:[],settings:{today,planAgeDays:90,source:'demo'}};
 const defs=[['29779','submitted','2026-10-12','Восстановить условия для мытья рук','2026-10-16'],['26511','approved','2026-09-30','Проверить маркировку и хранение продуктов','2026-10-12'],['26051','returned','2026-07-01','Обновить программу уборки и контроль исполнения','2026-10-20']];
 for(const [siteId,status,updatedAt,title,due] of defs.filter(d=>has(d[0]))){
  const id='plan-'+siteId,versionId='version-'+siteId+'-1',actionId='action-'+siteId+'-1';
  const action={id:actionId,planId:id,siteId,title,due,assignee:'Исполнитель ПБО (демо)',status:'open',revision:0,comment:'',evidence:[],sourceQuestionId:siteId==='29779'?'10.FS':null,sourceVisitId:siteId==='29779'?'workflow-source-29779':null};
  w.actions.push(action);w.plans.push({id,siteId,title:'План действий · '+sites.find(s=>s.id===siteId).name,status,versionId,revision:0,updatedAt,approvedAt:status==='approved'?updatedAt:null,author:'Директор ПБО (демо)',source:'demo'});
  w.planVersions.push({id:versionId,planId:id,number:1,submittedAt:updatedAt,decision:status==='submitted'?null:status,comment:status==='returned'?'Уточните ответственного и подтверждение исполнения.':'',items:[{...action}]});
  w.tasks.push({id:'approval-'+siteId,siteId,planId:id,type:'approval',title:'Согласовать план действий',due:'2026-10-15',status:status==='submitted'?'open':status==='approved'?'completed':'waiting',revision:0,assignee:status==='returned'?'Директор ПБО (демо)':'КпП (демо)'});
 }
 function assignment(id,siteId,title,kind,due,extra={}){
  if(!has(siteId))return;w.assignments.push({id,siteId,title,kind,due,status:'open',revision:0,sectionIndexes:null,source:'demo',...extra});
  w.tasks.push({id:'task-'+id,siteId,assignmentId:id,type:'assignment',title,due,status:'open',revision:0,assignee:'КпП (демо)'});
  w.programItems.push({id:'program-'+id,siteId,assignmentId:id,title,status:'open',source:'demo'});
 }
 assignment('assignment-main','29779','Провести аудит безопасности пищи','main','2026-10-18');
 assignment('assignment-repeat','26511','Повторная проверка · гигиена','repeat','2026-10-14',{sectionIndexes:[0],direction:'Безопасность пищи'});
 assignment('assignment-support','26051','Поддерживающая проверка · ИПУР','support','2026-10-16',{processId:'process-26051',stage:'support',direction:'Безопасность пищи',scopeNote:'Состав этапа в примере: существующий аудит безопасности пищи. Производственный опросник этапа не передан.'});
 if(has('26051'))w.processes.push({id:'process-26051',siteId:'26051',stage:'support',startedAt:'2026-10-01',direction:'Безопасность пищи',revision:0,source:'demo'});
 w.events.push({id:'seed',at:today,type:'seed',actor:'Демонстрационный набор',text:'Данные примера добавлены. Это не назначения рабочей системы.'});
 return w;
}
if(typeof module==='object'&&module.exports)module.exports={seed};else root.PuskWorkspaceSeed={seed};
})(typeof window==='object'?window:globalThis);
