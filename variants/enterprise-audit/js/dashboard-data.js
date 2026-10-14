/* Dashboard data belongs to X3; no plan or remediation status is inferred. */
(function(root){
  'use strict';
  const newest=(a,b)=>b.date.localeCompare(a.date)||(b.completedAt||'').localeCompare(a.completedAt||'');
  function build(pbos,visits,summarize,{from='',to=''}={}){
    const local=visits.filter(v=>!v.example);
    const completed=local.filter(v=>v.done&&(!from||v.date>=from)&&(!to||v.date<=to));
    const drafts=local.filter(v=>!v.done).slice().sort(newest);
    const sites=pbos.map(p=>({...p}));
    for(const v of local)if(!sites.some(p=>p.id===v.pbo))sites.push({id:v.pbo,name:'ПБО '+v.pbo});
    const rows=sites.map(p=>{
      const latest=completed.filter(v=>v.pbo===p.id).slice().sort(newest)[0]||null;
      const result=latest?summarize(latest):null;
      const remarks=latest?Object.values(latest.answers).filter(a=>a==='Нет'||a==='Частично Да').length:0;
      return {...p,latest,result,remarks,critical:result?.criticalNo.length||0,falsification:latest?.falsification==='Да',drafts:drafts.filter(v=>v.pbo===p.id)};
    });
    return {rows,drafts,completed:completed.length,criticalSites:rows.filter(r=>r.critical>0).length};
  }
  function filterRows(rows,{query='',status='all'}={}){
    const needle=query.trim().toLocaleLowerCase('ru');
    return rows.filter(r=>(r.id+' '+r.name).toLocaleLowerCase('ru').includes(needle)&&
      (status==='all'||status==='work'&&r.drafts.length||status==='remarks'&&(r.remarks||r.falsification)||status==='critical'&&r.critical||status==='missing'&&!r.latest));
  }
  const api={build,filterRows};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.PuskDashboard=api;
})(typeof window==='object'?window:globalThis);
