const {test}=require('node:test');const assert=require('node:assert/strict');const {app,KEY}=require('./helpers/app-harness.cjs');

test('X4 starts with automatic scroll after Yes',()=>{
 const h=app();assert.equal(h.state().answerMode,'scroll');
});
test('old demo preferences switch to the new default once without losing answers',()=>{
 const old=app({visit:{comments:{'10.FS':'Сохранённое пояснение'}}});const data=old.state();
 delete data.answerModeDefaultVersion;data.answerMode='manual';old.storage.set(KEY,JSON.stringify(data));
 const h=app({storage:old.storage});assert.equal(h.state().answerMode,'scroll');
 assert.equal(h.state().visits[0].comments['10.FS'],'Сохранённое пояснение');
 h.change({id:'answer-mode',value:'manual'});
 assert.equal(app({storage:h.storage}).state().answerMode,'manual');
});
