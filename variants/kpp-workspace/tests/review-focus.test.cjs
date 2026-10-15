const {test}=require('node:test');const assert=require('node:assert/strict');const {app}=require('./helpers/app-harness.cjs');

test('automatic scroll runs only for Yes so No remains available for evidence',()=>{
 let moves=0;const cards=[{dataset:{question:'10.FS'}},{dataset:{question:'11.FS'},scrollIntoView(){moves++;}}];
 const h=app({visit:{},questionCards:cards});h.click('nav',{view:'form'});h.change({id:'answer-mode',value:'scroll'});
 h.change({dataset:{answer:'10.FS'},value:'Нет'});assert.equal(moves,0);
 h.change({dataset:{answer:'10.FS'},value:'Да'});assert.equal(moves,1);
});

test('No never collapses its reasons even when collapse is selected',()=>{
 const h=app({visit:{answers:{'10.FS':'Нет'}}});h.click('nav',{view:'form'});h.change({id:'answer-mode',value:'collapse'});
 assert.doesNotMatch(h.screen(),/class="question collapsed" data-question="10\.FS"/);assert.match(h.screen(),/Укажите причину/);
});

test('review has one set of section answers and PDF updates after general return to filling',()=>{
 const h=app({visit:{}});h.click('nav',{view:'form'});h.change({dataset:{answer:'1.FS.Критический'},value:'Нет'});h.input({dataset:{comment:'1.FS.Критический'},value:'Причина критического ответа'});h.click('nav',{view:'review'});const html=h.screen();
 assert.equal((html.match(/class="review-stats/g)||[]).length,1);
 assert.match(html,/Критические вопросы/);assert.match(html,/Критических «Нет»: 1/);
 assert.match(html,/class="review-section/);assert.doesNotMatch(html,/<summary>Все ответы/);
 assert.equal((html.match(/data-review-question="1.FS.Критический"/g)||[]).length,1);
 assert.doesNotMatch(html,/data-action="edit-question"/);
 h.click('nav',{view:'form'});h.click('select-section',{index:5});assert.equal(h.state().view,'form');
 h.change({dataset:{answer:'1.FS.Критический'},value:'Да'});h.click('nav',{view:'review'});h.click('pdf');
 assert.equal(h.reports.at(-1).questions.find(q=>q.id==='1.FS.Критический').answer,'Да');
});

test('demo photo requires explicit local confirmation and is labelled in report data',()=>{
 const h=app({visit:{}});h.click('nav',{view:'form'});h.click('add-photo',{id:'10.FS'});
 assert.match(h.html('#sheet'),/Демонстрационное фото/);assert.equal(h.state().visits[0].demoPhotos?.['10.FS'],undefined);
 h.click('confirm-demo-photo',{id:'10.FS'});assert.equal(h.state().visits[0].demoPhotos['10.FS'],true);
 h.click('nav',{view:'review'});h.click('pdf');assert.equal(h.reports.at(-1).questions.find(q=>q.id==='10.FS').demoPhoto,true);
 h.click('nav',{view:'form'});h.click('remove-demo-photo',{id:'10.FS'});assert.equal(h.state().visits[0].demoPhotos['10.FS'],undefined);
});

test('finished answers and demo evidence cannot be changed',()=>{
 const h=app({visit:{done:true,demoPhotos:{'10.FS':true}}});
 assert.doesNotMatch(h.screen(),/data-action="edit-question"/);
 h.click('remove-demo-photo',{id:'10.FS'});h.click('confirm-demo-photo',{id:'11.FS'});
 assert.deepEqual(h.state().visits[0].demoPhotos,{'10.FS':true});
});


test('No with no supplied reason options exposes free explanation without inventing options',()=>{
 const h=app({visit:{answers:{'1.FS.Критический':'Нет'},section:5}});h.click('edit-question',{id:'1.FS.Критический'});
 assert.match(h.screen(),/data-comment="1.FS.Критический"/);assert.doesNotMatch(h.screen(),/data-free-reason|Не течет вода/);
});
