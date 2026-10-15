/* Rules owned by kpp-workspace only; no dependencies on adjacent variants. */
(function(root){
  'use strict';
  const drafts=(visits,pbo)=>visits.filter(v=>!v.done&&!v.example&&v.pbo===pbo).slice().sort((a,b)=>b.date.localeCompare(a.date));
  function filterVisits(visits,{pbo,area,tab,query='',from='',to=''},text){
    const needle=query.trim().toLocaleLowerCase('ru');
    return visits.filter(v=>(area==='all'||v.pbo===pbo)&&v.done===(tab==='done')&&(!from||v.date>=from)&&(!to||v.date<=to)&&text(v).toLocaleLowerCase('ru').includes(needle)).slice().sort((a,b)=>b.date.localeCompare(a.date));
  }
  function captureCursor(cards,top,section,scope){
    const card=cards.find(c=>c.bottom>top+8)||cards.at(-1);
    return card?{questionId:card.id,offset:card.top-top,section,scope}:null;
  }
  const canFinish=(v,complete)=>!!(v&&v.agreed&&!v.done&&complete&&(v.checklistId!=='people-practices'||v.falsificationConfirmed&&['Да','Нет'].includes(v.falsification)));
  const api={drafts,filterVisits,captureCursor,canFinish};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PuskVisitUX=api;
})(typeof window==='object'?window:globalThis);
