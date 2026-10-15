const {test}=require('node:test');const assert=require('node:assert/strict');const S=require('../js/visit-scope.js');
const all=[{id:'a',critical:false},{id:'b',critical:false},{id:'c',critical:true}],sections=[{name:'one',questions:all.slice(0,2)},{name:'critical',critical:true,questions:all.slice(2)}];
test('partial progress and failure ignore excluded critical answer',()=>{const s=S.summary(all,sections,{questionIds:['a','b'],answers:{a:'Да',b:'Нет',c:'Нет'},falsification:'Нет'});assert.equal(s.total,2);assert.equal(s.percent,50);assert.equal(s.complete,true);assert.equal(s.criticalNo.length,0);assert.equal(s.sections.length,1);});
test('invalid assignment questions cannot silently become a full or empty audit',()=>{assert.throws(()=>S.questions(all,{questionIds:['unknown']}));assert.throws(()=>S.questions(all,{questionIds:[]}));assert.throws(()=>S.questions(all,{questionIds:['a','a']}));});

test('completed result fails below 80 and passes at exactly 80',()=>{
 const qs=Array.from({length:10},(_,i)=>({id:'q'+i})),secs=[{name:'section',questions:qs}];
 for(const [yes,expected] of [[7,'Неудовлетворительный результат'],[8,'Удовлетворительный результат'],[9,'Удовлетворительный результат']]){
  const s=S.summary(qs,secs,{answers:Object.fromEntries(qs.map((q,i)=>[q.id,i<yes?'Да':'Нет']))});
  assert.equal(s.outcome,expected);
 }
});

test('critical No still fails above 80 while valid Not applicable counts as answered',()=>{
 const qs=Array.from({length:10},(_,i)=>({id:'q'+i,critical:i===0})),secs=[{name:'section',questions:qs}];
 const answers=Object.fromEntries(qs.map(q=>[q.id,'Да']));answers.q0='Нет';
 assert.equal(S.summary(qs,secs,{answers}).outcome,'Неудовлетворительный результат');
 answers.q0='Неактуально';const s=S.summary(qs,secs,{answers});
 assert.equal(s.complete,true);assert.equal(s.percent,90);assert.equal(s.outcome,'Удовлетворительный результат');
});
