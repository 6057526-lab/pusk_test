/* Own X4 validation: cause of No is entered in the comment. */
(function(root){'use strict';
 const options=q=>Array.isArray(q.why)?q.why:[];
 const selected=(q,v)=>Array.isArray(v.reasons[q.id])?v.reasons[q.id].filter(x=>options(q).includes(x)):[];
 const text=(q,v)=>String(v.comments[q.id]||'').trim();
 const needsText=(q,v)=>!options(q).length||selected(q,v).includes('Другое');
 const valid=(q,v)=>v.answers[q.id]!=='Нет'||(options(q).length?selected(q,v).length>0&&(!needsText(q,v)||text(q,v).length>0):text(q,v).length>0);
 const details=(q,v)=>v.answers[q.id]==='Нет'?selected(q,v):[];
 const comment=(q,v)=>v.comments[q.id]||'';
 function migrate(qs,v){if(v.commentReasonMigration===1)return;for(const q of qs){const legacy=String(v.reasonTexts?.[q.id]||'').trim(),current=String(v.comments[q.id]||'');if(legacy){if(!current.trim())v.comments[q.id]=legacy;else if(current.trim()!==legacy)v.comments[q.id]=legacy+'\n'+current;}}v.commentReasonMigration=1;}
 const api={options,selected,text,needsText,valid,details,comment,migrate};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.PuskVisitReasons=api;
})(typeof window==='object'?window:globalThis);
