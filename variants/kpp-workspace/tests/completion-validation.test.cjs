const {test}=require('node:test');const assert=require('node:assert/strict');const {app}=require('./helpers/app-harness.cjs');
function emptyFood(){const h=app();h.click('choose-visit-type',{id:'food-safety'});h.click('select-pbo',{id:'29779'});h.click('start');h.click('agree');return h;}

test('old saved incomplete review resumes in the form with answers preserved',()=>{
 const h=app({visit:{questionIds:['10.FS','11.FS'],answers:{'10.FS':'Да'}}});
 assert.equal(h.state().view,'form');assert.equal(h.state().visits[0].answers['10.FS'],'Да');
 assert.match(h.screen(),/Осталось ответить: 1/);
});

test('Check answers on last section keeps incomplete form and shows a recoverable error',()=>{
 const h=emptyFood();h.click('select-section',{index:4});h.click('next-section');
 assert.equal(h.state().view,'form');assert.equal(h.state().section,4);
 assert.match(h.html('#form-validation'),/role="alert"/);assert.match(h.html('#form-validation'),/48/);
 h.click('scope',{scope:'missing'});assert.equal(h.state().view,'form');assert.match(h.screen(),/Вопросы без ответа/);
});

test('direct review navigation cannot bypass missing answers, including partial scope',()=>{
 const h=app({visit:{questionIds:['10.FS','11.FS'],answers:{'10.FS':'Да'}}});h.click('nav',{view:'form'});h.click('nav',{view:'review'});
 assert.equal(h.state().view,'form');assert.match(h.html('#form-validation'),/Осталось ответить: 1/);
 h.change({dataset:{answer:'11.FS'},value:'Неактуально'}); // not a supplied option for this question
 assert.equal(h.state().visits[0].answers['11.FS'],undefined);
 h.change({dataset:{answer:'11.FS'},value:'Да'});h.click('next-section');assert.equal(h.state().view,'review');
});

test('valid Not applicable clears validation and updated 80-percent outcome reaches PDF',()=>{
 const answers={p_q1:'Да',p_q2:'Да',p_q3:'Да',p_q4:'Да'};
 const h=app({visit:{checklistId:'people-practices',answers}});h.click('nav',{view:'form'});h.click('nav',{view:'review'});
 assert.equal(h.state().view,'form');h.change({dataset:{answer:'p_q5'},value:'Неактуально'});h.click('nav',{view:'review'});
 assert.equal(h.state().view,'review');h.click('pdf');assert.equal(h.reports.at(-1).summary.percent,80);
 assert.equal(h.reports.at(-1).summary.outcome,'Удовлетворительный результат');
});
