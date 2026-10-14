(function(root){'use strict';
 const D=typeof module==='object'&&module.exports?require('./workspace-domain.js'):root.PuskWorkspaceDomain;
 function createRepository({readState,writeState,sites=[],actor='kpp-demo',today='2026-10-13',now=()=>new Date().toISOString()}){
  let queue=Promise.resolve();
  async function load(){const state=readState();if(!state.workspace){const workspace=D.migrateWorkspace(null,{sites,today});await writeState({...state,workspace});}return readState().workspace;}
  async function query(kind,filter={}){const w=await load();if(kind==='queue')return D.selectQueue(w,readState().visits,filter);if(kind==='plan')return D.selectPlan(w,filter.id);if(kind==='program')return D.selectProgram(w,filter.siteId);if(!Array.isArray(w[kind]))throw Error('Unknown collection');return w[kind].filter(e=>!filter.siteId||e.siteId===filter.siteId);}
  function execute(command){const work=queue.then(async()=>{await load();const state=readState(),r=D.applyCommand(state.workspace,command,{actor,now:now()});let next={...state,workspace:r.workspace};if(command.type==='link_assignment'&&command.payload?.visit){const visit=command.payload.visit;if(visit.id!==command.payload.visitId)throw Error('Некорректная связь визита.');if(!state.visits.some(v=>v.id===visit.id))next.visits=[visit,...state.visits];}await writeState(next);return r.result;});queue=work.catch(()=>{});return work;}
  return {load,query,execute};
 }
 if(typeof module==='object'&&module.exports)module.exports={createRepository};else root.PuskWorkspaceRepository={createRepository};
})(typeof window==='object'?window:globalThis);
