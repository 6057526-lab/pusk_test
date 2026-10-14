const {test}=require('node:test');
const assert=require('node:assert/strict');
const D=require('../js/dashboard-data.js');
const pbos=[{id:'1',name:'Озёрная'},{id:'2',name:'Лакинск'},{id:'3',name:'Нет визитов'}];
const summarize=v=>({criticalNo:Array(v.critical||0).fill({}),percent:75,answered:10});
const visit=(id,pbo,date,extra={})=>({id,pbo,date,done:true,answers:{a:'Да'},...extra});

test('excludes the demonstration example from results and enterprise history',()=>{
  const m=D.build(pbos,[visit('sample','1','2026-10-13',{example:true})],summarize,{});
  assert.equal(m.completed,0);assert.equal(m.criticalSites,0);assert.equal(m.rows[0].latest,null);
});
test('latest result supersedes older critical answer; counts sites, not answers',()=>{
  const data=[visit('old','1','2026-10-10',{critical:3,answers:{a:'Нет'}}),visit('new','1','2026-10-12'),visit('bad','2','2026-10-13',{critical:4,answers:{a:'Нет'}})];
  const m=D.build(pbos,data,summarize,{});
  assert.equal(m.completed,3);assert.equal(m.criticalSites,1);assert.equal(m.rows[0].latest.id,'new');assert.equal(m.rows[0].remarks,0);
});
test('inclusive date range affects results but never hides unfinished work',()=>{
  const data=[visit('before','1','2026-09-30'),visit('in','1','2026-10-01'),visit('after','2','2026-10-03'),visit('draft','2','2026-09-01',{done:false})];
  const m=D.build(pbos,data,summarize,{from:'2026-10-01',to:'2026-10-01'});
  assert.equal(m.completed,1);assert.equal(m.drafts.length,1);assert.equal(m.rows[1].latest,null);assert.equal(m.rows[1].drafts[0].id,'draft');
});
test('same-day latest visit uses completion time without mutating source',()=>{
  const data=[visit('early','1','2026-10-13',{completedAt:'2026-10-13T08:00:00Z'}),visit('late','1','2026-10-13',{completedAt:'2026-10-13T12:00:00Z'})];
  assert.equal(D.build(pbos,data,summarize,{}).rows[0].latest.id,'late');assert.equal(data[0].id,'early');
});
test('search/status retain no-data enterprises and distinguish latest remarks',()=>{
  const m=D.build(pbos,[visit('partial','1','2026-10-13',{answers:{a:'Частично Да'}})],summarize,{});
  assert.equal(D.filterRows(m.rows,{query:' оЗЁР ',status:'remarks'}).length,1);
  assert.equal(D.filterRows(m.rows,{query:'2',status:'all'})[0].name,'Лакинск');
  assert.equal(D.filterRows(m.rows,{query:'',status:'missing'}).length,2);
});
