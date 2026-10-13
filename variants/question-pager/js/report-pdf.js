/* Self-contained X4 PDF export; libraries and Cyrillic font live in this copy. */
window.PuskReportPdf = (() => {
  async function create(data) {
    const {PDFDocument,rgb} = window.PDFLib;
    const doc = await PDFDocument.create();
    doc.registerFontkit(window.fontkit);
    const fontBytes = Uint8Array.from(atob(window.PUSK_REPORT_FONT),c=>c.charCodeAt(0));
    const font = await doc.embedFont(fontBytes,{subset:true});
    doc.setTitle(data.preliminary?'ПУСК — предварительный отчёт':'ПУСК — отчёт по визиту');doc.setSubject('Демонстрационный аудит безопасности пищи');
    let page,y;
    const ink = rgb(.12,.2,.15),green = rgb(.16,.34,.23);
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
    text('ПУСК · Аудит безопасности пищи',18,green);
    text(data.preliminary?'Предварительный отчёт по визиту':'Отчёт по визиту',14,green);
    if(data.preliminary)text('Визит ещё не завершён. Ответы и комментарии можно изменить.',10);
    for(const [key,value] of data.metadata)text(key+': '+value);
    text('Факт фальсификации: '+data.falsification);
    heading('Общий итог визита');
    text(data.summary.outcome,13);
    text('Отвечено: '+data.summary.answered+' / '+data.summary.total);
    text('Доля «Да»: '+data.percent+' · '+data.summary.yes+' / '+data.summary.total);
    text('Демонстрационный расчёт: процент — доля «Да» от всех вопросов. «Частично Да» и «Неактуально» не увеличивают процент. Критический «Нет» или фальсификация — неудовлетворительный результат. Бизнес-формула требует согласования.',9);
    heading('Итоги по разделам');
    for(const section of data.sections)text(section.name+': '+section.percent+' («Да»: '+section.yes+' / '+section.total+')');
    heading('Критические вопросы с 0 баллов («Нет»)');
    if(!data.summary.criticalNo.length)text('Нет критических ответов «Нет»');
    for(const q of data.summary.criticalNo)text(q.label+' — '+q.text);
    heading('Все ответы');
    let lastSection='';
    for(const q of data.questions) {
      if(q.section!==lastSection){heading(q.section);lastSection=q.section;}
      if(y<100)newPage();
      text(q.label+' · '+q.text,10);
      text('Ответ: '+q.answer,10,green);
      if(q.reasons.length)text('Причины: '+q.reasons.join('; '),9);
      if(q.comment)text('Комментарий: '+q.comment,9);
      if(q.photo) {
        try {
          const img=q.photo.startsWith('data:image/png')?await doc.embedPng(q.photo):await doc.embedJpg(q.photo);
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
  return {create};
})();
