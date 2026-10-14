/* X4 demonstration catalogue. Local IDs are not production checklist/version IDs.
 * Names: source prototype CHECKLIST_OPTIONS and imported project description §4.1.
 * Only food-safety has a supplied questionnaire; preparations are not visits.
 */
(function(root){
  'use strict';
  const DEFAULT_ID='food-safety';
  const items=[
    {id:DEFAULT_ID,name:'Аудит безопасности пищи',sourceName:'Аудит по Безопасности пищи New',description:'Проверка безопасности пищи',ready:true,questionCount:48},
    {id:'people-practices',name:'Практики работы с людьми',sourceName:'Практики работы с Людьми 2026',description:'Отдельный визит по практикам работы с людьми',ready:false},
    {id:'high-level',name:'Управление предприятием на высоком уровне',sourceName:'Визит по Управлению Предприятиями на Высоком Уровне',description:'Комплексная проверка предприятия · ВпУПнВУ',ready:false},
    {id:'business-planning',name:'Бизнес-планирование',sourceName:'Бизнес-планирование',description:'Отдельный визит в начале цикла',ready:false,note:'В рабочей системе доступность зависит от даты открытия ПБО. Эти данные пока не подключены.'},
    {id:'supporting',name:'Поддерживающие визиты ПУСК',sourceName:'Поддерживающие визиты ПУСК',description:'Поддерживающий визит вне назначенного этапа ИПУР',ready:false,note:'Назначенные повторные и ИПУР-проверки открываются из задач со своим составом вопросов.'}
  ];
  const get=id=>items.find(c=>c.id===id);
  const identity=v=>v.checklistId||DEFAULT_ID;
  const visitName=v=>get(identity(v))?.name||v.checklistName||'Неизвестный чек-лист';
  function search(query=''){
    const needle=query.trim().toLocaleLowerCase('ru');
    return items.filter(c=>(c.name+' '+c.sourceName+' '+c.description).toLocaleLowerCase('ru').includes(needle));
  }
  function findDraft(visits,{pbo,date,checklistId}){
    return visits.find(v=>!v.done&&!v.example&&!v.assignmentId&&v.pbo===pbo&&v.date===date&&identity(v)===checklistId);
  }
  function findPreparation(records,{pbo,date,checklistId}){
    return records.find(v=>v.pbo===pbo&&v.date===date&&v.checklistId===checklistId);
  }
  const api={DEFAULT_ID,items,get,identity,visitName,search,findDraft,findPreparation};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PuskChecklistCatalog=api;
})(typeof window==='object'?window:globalThis);
