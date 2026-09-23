/* Host-owned presentation controls; application state remains independent. */
(()=>{
 const variants=[
  {id:'baseline',label:'X1 · Исходник',url:'../prototype/index.html'},
  {id:'current-mobile',label:'Текущая мобильная',url:'../variants/current-mobile/index.html'},
  {id:'product-proposal',label:'X2 · Для продакта',url:'../variants/product-proposal/index.html'},
  {id:'visit-workspace',label:'X3 · Удобное внесение',url:'../variants/visit-workspace/index.html',storage:'pusk:visit-workspace:v1'},
  {id:'question-pager',label:'X4 · По одному вопросу',url:'../variants/question-pager/index.html',storage:'pusk:question-pager:v1'}
 ];
 const frames=new Map();let active;
 function select(id){
  const variant=variants.find(v=>v.id===id)||variants[1];active=variant.id;
  for(const [key,frame] of frames)frame.hidden=key!==active;
  if(!frames.has(active)){
   const frame=document.createElement('iframe');frame.id=active;frame.title=variant.label;
   frame.addEventListener('load',()=>decorate(frame,variant));frames.set(active,frame);document.body.append(frame);frame.src=variant.url;
  }
  frames.get(active).hidden=false;history.replaceState(null,'','#'+active);
 }
 function decorate(frame,variant){
  const doc=frame.contentDocument;if(!doc)return;
  const style=doc.createElement('style');
  style.textContent=`html,body{width:100%;height:100%;padding:0!important;margin:0!important;background:white!important;overflow:hidden}.phone-shell{width:100%!important;max-width:none!important;height:100dvh!important;border:0!important;border-radius:0!important;box-shadow:none!important}.hint-bar{display:none!important}.demo-options{margin:32px 16px 20px;padding-top:20px;border-top:1px solid #ffffff38;color:white;font:14px/1.5 system-ui,sans-serif;clear:both}.demo-options summary{cursor:pointer;min-height:44px;display:flex;align-items:center}.demo-options label{display:block;color:#ddd;font-size:12px;margin:10px 0 6px}.demo-options select,.demo-options button,.demo-options a{font:inherit;display:block;width:100%;min-height:44px;padding:10px;border:1px solid #66736b;border-radius:6px;background:#fff;color:#203a2b;text-align:left;margin:8px 0;text-decoration:none}.demo-options p{font-size:12px;color:#ccc}.demo-menu-button{min-height:40px;min-width:40px;border:0;background:none;color:inherit;font-size:23px;flex-shrink:0}`;
  doc.head.append(style);
  const panel=doc.querySelector('.menu-panel');
  if(panel){
   const details=doc.createElement('details');details.className='demo-options';
   details.innerHTML='<summary>Варианты прототипа</summary><label for="demo-variant">Открытый вариант</label><select id="demo-variant" aria-label="Вариант прототипа"></select><button type="button" class="demo-reset">Начать заново</button><a target="_blank" rel="noopener">Открыть этот вариант отдельно</a><p>Переключение сохраняет состояние каждого варианта.</p>';
   const picker=details.querySelector('select');for(const v of variants){const option=doc.createElement('option');option.value=v.id;option.textContent=v.label;option.selected=v.id===variant.id;picker.append(option);}
   picker.addEventListener('change',()=>{const id=picker.value;picker.value=variant.id;doc.querySelector('#menu').hidden=true;select(id);});
   details.querySelector('a').href=new URL(variant.url,location.href).href;
   details.querySelector('.demo-reset').addEventListener('click',()=>{if(!confirm('Начать заново '+variant.label+'? Данные этого визита будут удалены.'))return;setTimeout(()=>{if(variant.storage)localStorage.removeItem(variant.storage);frame.src=variant.url;},0);});
   panel.append(details);
   for(const header of doc.querySelectorAll('.screen > header')){
    if(header.querySelector('[data-action="open-menu"]'))continue;
    const button=doc.createElement('button');button.className='demo-menu-button';button.type='button';button.setAttribute('aria-label','Меню');button.textContent='☰';button.addEventListener('click',()=>{doc.querySelector('#menu').hidden=false;});header.append(button);
   }
  }
 }
 window.addEventListener('hashchange',()=>select(location.hash.slice(1)));
 select(location.hash.slice(1));
})();

