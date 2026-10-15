const {test}=require('node:test');const assert=require('node:assert/strict');const {app}=require('./helpers/app-harness.cjs');

test('completed records remain stored but are excluded from the active visit list',()=>{
 const h=app({visit:{done:true}});h.click('nav',{view:'visits'});
 assert.equal(h.state().visits[0].done,true);assert.doesNotMatch(h.screen(),/data-id="user-draft"/);
 assert.doesNotMatch(h.screen(),/data-tab="done"|История визитов/);
 h.click('visit-catalog');assert.doesNotMatch(h.screen(),/История завершённых/);
});

test('section results only allow general return to the questionnaire',()=>{
 const h=app({visit:{}});assert.doesNotMatch(h.screen(),/data-action="edit-question"/);
 h.click('edit-question',{id:'10.FS'});assert.equal(h.state().view,'review');
 h.click('nav',{view:'form'});assert.equal(h.state().view,'form');
});
