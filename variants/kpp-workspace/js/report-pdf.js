/* X4 PDF export copied from question-pager; all libraries and fonts belong to this variant. */
window.PuskReportPdf = (() => {
  async function create(data) {
    const {PDFDocument,rgb} = window.PDFLib;
    const doc = await PDFDocument.create();
    doc.registerFontkit(window.fontkit);
    const fontBytes = Uint8Array.from(atob(window.PUSK_REPORT_FONT),c=>c.charCodeAt(0));
    const font = await doc.embedFont(fontBytes,{subset:true});
    doc.setTitle(data.preliminary?'ПУСК — предварительный отчёт':'ПУСК — отчёт по визиту');doc.setSubject('Демонстрационный визит · '+(data.checklistName||'Аудит безопасности пищи'));
    let page,y;
    const ink = rgb(.12,.2,.15),green = rgb(.16,.34,.23),red = rgb(.65,.15,.10),amber = rgb(.45,.29,.07);
    const newPage = () => {page=doc.addPage([595.28,841.89]);y=798;};
    newPage();
    function lines(value,size,width=507) {
      const result=[];
      for(const paragraph of String(value).replace(/\r/g,'').split('\n')) {
        let line='';
        for(const word of paragraph.split(/\s+/).filter(Boolean)) {
          const candidate=line?line+' '+word:word;
          if(font.widthOfTextAtSize(candidate,size)<=width){line=candidate;continue;}
          if(line){result.push(line);line='';}
          // Long comments/URLs wrap without extending past the page.
          for(const char of word) {
            if(line && font.widthOfTextAtSize(line+char,size)>width){result.push(line);line='';}
            line+=char;
          }
        }
        result.push(line);
      }
      return result;
    }
    function text(value,size=10,color=ink) {
      for(const line of lines(value,size)) {
        if(y<52)newPage();
        if(line)page.drawText(line,{x:44,y,size,font,color});
        y-=size*1.5;
      }
      y-=5;
    }
    function heading(value) {if(y<96)newPage();text(value,13,green);}
    text('ПУСК · '+(data.checklistName||'Аудит безопасности пищи'),18,green);
    text(data.preliminary?'Предварительный отчёт по визиту':'Отчёт по визиту',14,green);
    if(data.preliminary)text('Визит ещё не завершён. Ответы и комментарии можно изменить.',10);
    for(const [key,value] of data.metadata)text(key+': '+value);
    if(data.falsification!==undefined)text('Факт фальсификации: '+data.falsification);
    heading('Общий итог визита');
    text(data.summary.outcome,13);
    text('Отвечено: '+data.summary.answered+' / '+data.summary.total);
    text('Результат: '+data.percent);
    heading('Итоги по разделам');
    for(const section of data.sections)text(section.name+': '+section.percent);
    heading('Критические вопросы с 0 баллов («Нет»)');
    if(!data.summary.criticalNo.length)text('Нет критических ответов «Нет»');
    for(const q of data.summary.criticalNo)text(q.label+' — '+q.text);
    heading('Все ответы');
    let lastSection='';
    for(const q of data.questions) {
      if(q.section!==lastSection){heading(q.section);lastSection=q.section;}
      if(y<100)newPage();
      if(q.critical)text('КРИТИЧЕСКИЙ ВОПРОС',10,q.answer==='Нет'?red:amber);
      text(q.label+' · '+q.text,10);
      text('Ответ: '+q.answer,10,green);
      if(q.reasons.length)text('Причины: '+q.reasons.join('; '),9);
      if(q.comment)text('Комментарий: '+q.comment,9);
      if(q.demoPhoto)text('Демо-фото добавлено. Это пример вложения; реальный файл не прикреплён.',9);
      if(q.photo) {
        try {
          // Detect the actual bytes: a chooser may attach a JPEG with a .png filename.
          const bytes=Uint8Array.from(atob(q.photo.split(',')[1]),c=>c.charCodeAt(0));
          const isPng=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
          const img=isPng?await doc.embedPng(bytes):await doc.embedJpg(bytes);
          const scale=Math.min(260/img.width,170/img.height,1);
          const width=img.width*scale,height=img.height*scale;
          if(y-height<60)newPage();
          page.drawImage(img,{x:44,y:y-height,width,height});y-=height+14;
        } catch {text('Фотография приложена к визиту; её формат не поддерживается экспортом PDF.',9);}
      }
      y-=7;
    }
    const pages=doc.getPages();
    pages.forEach((p,i)=>p.drawText('ПУСК · '+(i+1)+' / '+pages.length,{x:44,y:28,size:9,font,color:green}));
    return doc.save();
  }
  async function createPlan({plan,version,site}){
    const {PDFDocument,rgb}=window.PDFLib,doc=await PDFDocument.create();doc.registerFontkit(window.fontkit);
    const font=await doc.embedFont(Uint8Array.from(atob(window.PUSK_REPORT_FONT),c=>c.charCodeAt(0)),{subset:true});
    doc.setTitle('ПУСК — план действий — версия '+version.number);let page,y;
    function newPage(){page=doc.addPage([595.28,841.89]);y=790;}newPage();
    function line(value,size=11){let current='';for(const word of String(value).split(/\s+/).flatMap(word=>{const pieces=[];let piece='';for(const ch of word){if(font.widthOfTextAtSize(piece+ch,size)>500){pieces.push(piece);piece=ch;}else piece+=ch;}if(piece)pieces.push(piece);return pieces;})){const next=current?current+' '+word:word;if(font.widthOfTextAtSize(next,size)>500&&current){draw(current,size);current=word;}else current=next;}if(current)draw(current,size);y-=10;}
    function draw(value,size){if(y<65)newPage();page.drawText(value,{x:44,y,size,font,color:rgb(.12,.23,.17)});y-=size*1.6;}
    line('ПУСК · План действий',20);line('Демонстрационный документ для согласования интерфейса',10);
    line('ПБО '+site.id+' · '+site.name,14);line('Версия '+version.number+' · передана '+version.submittedAt);
    line('Автор: '+plan.author);line('Решение: '+({approved:'Согласован',returned:'На доработке'}[version.decision]||'На согласовании'));
    if(version.comment)line('Комментарий к решению: '+version.comment);
    line('Состав зафиксированной версии',15);
    let lastGroup='';for(const [i,a] of version.items.entries()){const groupId=a.planTaskId||version.groupMap?.[a.id];if(groupId&&groupId!==lastGroup){const task=version.tasks?.find(t=>t.id===groupId);if(task)line('Задача плана: '+task.title,14);lastGroup=groupId;}line((i+1)+'. '+a.title,12);line('Ответственный: '+a.assignee);line('Срок: '+a.due);if(a.sourceQuestionId)line('Связанный вопрос исходного аудита: '+a.sourceQuestionId);}
    line('Согласование плана не подтверждает исполнение действий. Состояние исполнения смотрите отдельно в рабочем пространстве.',10);
    doc.getPages().forEach((p,i)=>p.drawText('ПУСК · ПД · '+(i+1)+' / '+doc.getPages().length,{x:44,y:28,size:9,font}));
    return doc.save();
  }
  return {create,createPlan};
})();
