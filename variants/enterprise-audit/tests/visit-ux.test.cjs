const {test}=require('node:test');
const assert=require('node:assert/strict');
const ux=require('../js/visit-ux.js');
const visits=[{id:'a',pbo:'29779',date:'2026-10-12',done:false},{id:'b',pbo:'29779',date:'2026-10-13',done:false},{id:'c',pbo:'26511',date:'2026-10-13',done:false},{id:'d',pbo:'29779',date:'2026-10-13',done:true}];
test('drafts stay available when the new visit date changes',()=>assert.deepEqual(ux.drafts(visits,'29779').map(v=>v.id),['b','a']));
test('typing a date never widens the selected enterprise scope',()=>assert.deepEqual(ux.filterVisits(visits,{pbo:'29779',area:'site',tab:'work',query:'13.10',from:'',to:''},v=>v.date.split('-').reverse().join('.')).map(v=>v.id),['b']));
test('all enterprises is an explicit filter, combined with status and period',()=>assert.deepEqual(ux.filterVisits(visits,{pbo:'29779',area:'all',tab:'work',query:'',from:'2026-10-13',to:'2026-10-13'},v=>v.id).map(v=>v.id),['b','c']));
test('cursor restores a partially visible question, including its offset',()=>assert.deepEqual(ux.captureCursor([{id:'10.FS',top:-450,bottom:60},{id:'11.FS',top:75,bottom:450}],100,0,'all'),{questionId:'11.FS',offset:-25,section:0,scope:'all'}));
test('legacy default No is insufficient for irreversible confirmation',()=>{assert.equal(ux.canFinish({agreed:true,done:false,falsification:'Нет'},true),false);assert.equal(ux.canFinish({agreed:true,done:false,falsification:'Нет',falsificationConfirmed:true},true),true);assert.equal(ux.canFinish({agreed:true,done:false,falsification:'Да',falsificationConfirmed:true},false),false);});
