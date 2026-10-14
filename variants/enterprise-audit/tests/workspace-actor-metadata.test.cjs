const {test}=require('node:test');const assert=require('node:assert/strict');const {app}=require('./helpers/app-harness.cjs');
test('new KpP visit report shows historical creator rather than old Test Hub fixture',()=>{const h=app({workspace:true,visit:{pbo:'3333333',creatorId:'kpp-successor-demo',done:true}});assert.match(h.screen(),/<dt>КпП<\/dt><dd>КпП · новый \(демо\)<\/dd>/);});
