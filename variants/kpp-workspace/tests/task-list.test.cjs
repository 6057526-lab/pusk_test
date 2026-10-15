const {test}=require('node:test');const assert=require('node:assert/strict');const {app}=require('./helpers/app-harness.cjs');

test('tasks use source checklist actions with author and date, without program assignments',()=>{
 const h=app({workspace:true});h.click('nav',{view:'tasks'});
 assert.match(h.screen(),/Заполнить форму/);assert.match(h.screen(),/Ознакомьтесь с информацией/);
 assert.match(h.screen(),/Администратор ПКВ/);assert.match(h.screen(),/Управление предприятием на высоком уровне/);
 assert.doesNotMatch(h.screen(),/Назначенные проверки|data-work="assignment"/);
});

test('filtering tasks never changes stored visits and excludes other recipients',()=>{
 const h=app({workspace:true,visit:{done:true,creatorId:'kpp-demo'}});h.click('nav',{view:'tasks'});
 const before=JSON.stringify(h.state().visits);h.click('task-filter',{value:'results'});
 assert.match(h.screen(),/Ознакомиться с результатами/);assert.doesNotMatch(h.screen(),/data-action="source-task"/);
 assert.doesNotMatch(h.screen(),/data-id="ack-dl-source"/);
 assert.equal(JSON.stringify(h.state().visits),before);
 h.click('task-filter',{value:'checklists'});assert.doesNotMatch(h.screen(),/data-work="task-open"/);
 assert.match(h.screen(),/Заполнить форму/);
});

test('pending result task opens its details and completed acknowledgements leave the queue',async()=>{
 const h=app({workspace:true,visit:{done:true,creatorId:'kpp-demo'}});h.click('nav',{view:'tasks'});
 assert.match(h.screen(),/data-work="task-open" data-id="ack-user-draft"/);
 h.work('task-open','ack-user-draft');assert.equal(h.state().view,'task');assert.match(h.screen(),/С результатами ознакомлен/);
 assert.match(h.screen(),/Аудит безопасности пищи/);assert.match(h.screen(),/12 октября 2026/);assert.doesNotMatch(h.screen(),/К предприятию/);
 h.work('acknowledge','ack-user-draft');await new Promise(resolve=>setImmediate(resolve));
 h.click('nav',{view:'tasks'});assert.doesNotMatch(h.screen(),/data-id="ack-user-draft"/);
 assert.equal(h.state().visits[0].done,true);
});

test('source food task goes directly to agreement then questions and resumes the same visit',()=>{
 const h=app({workspace:true});h.click('nav',{view:'tasks'});h.click('source-task',{id:'form-food'});
 assert.equal(h.state().view,'consent');const id=h.state().active;
 h.click('agree');assert.equal(h.state().view,'form');
 h.click('nav',{view:'tasks'});assert.doesNotMatch(h.screen(),/data-id="form-food"/);
 assert.equal(h.state().visits.find(v=>v.id===id).sourceTaskAuthor,'Администратор ПКВ');
 assert.equal(h.state().visits.find(v=>v.id===id).sourceTaskCreated,'22 сентября 2026 · 12:36');
 h.click('open-visit',{id});assert.equal(h.state().active,id);assert.equal(h.state().view,'form');
});

test('unsupported source task opens its information without fabricating a food audit',()=>{
 const h=app({workspace:true});h.click('nav',{view:'tasks'});const count=h.state().visits.length;
 h.click('source-task',{id:'form-hlm'});
 assert.match(h.html('#sheet'),/Опросник этого вида визита пока не подключён/);
 assert.equal(h.state().visits.length,count);assert.equal(h.state().view,'tasks');
});
