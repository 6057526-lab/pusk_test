(() => {
  const PBOS = [
    { name: "3333333 Test Hub", legal: 'ООО "Система ПБО"' },
    { name: "101113 Открытие ПБО в начале месяца «Бизнес-планирование»", legal: "Элемент загружается …" },
    { name: "26051 Батайск Парк", legal: "Элемент загружается …" },
    { name: "26511 Лакинск", legal: "Элемент загружается …" },
    { name: "29779 Озёрная", legal: "Элемент загружается …" },
  ];

  const FOOD_CATS = window.PUSK_QUESTIONS;

  const REPORT_PBOS = [
    { name: "70352 Набережные Челны Сити Молл", legal: 'ООО "СПП"' },
    { name: "70326 Нижнекамск Нефтехимиков", legal: 'ООО "СПП"' },
    { name: '70307 Ижевск "Мой порт"', legal: 'ООО "СПП"' },
    { name: "3333333 Test Hub", legal: 'ООО "Система ПБО"' },
    { name: "27604 Пермь Семья", legal: 'ООО "Система ПБО"' },
    { name: "24201 Воронеж Революции (ТЕСТ)", legal: 'ООО "Система ПБО"' },
    { name: "11003 Арбат (ТЕСТ)", legal: 'ООО "Система ПБО"' },
    { name: "29188 Твид Молл", legal: 'ООО "Система ПБО"' },
    { name: "26051 Батайск Парк", legal: 'ООО "Система ПБО"' },
  ];

  const VISIT_OPTIONS = [
    { name: "Аудит по Безопасности пищи New", start: "13 апреля 2026 г." },
    { name: "тест", start: "6 февраля 2026 г." },
    { name: "Тестовый", start: "1 февраля 2026 г." },
    { name: "Практики работы с Людьми 2026", start: "20 августа 2026 г." },
    { name: "Поддерживающие визиты ПУСК", start: "22 сентября 2026 г." },
  ];

  const CHECKLIST_OPTIONS = [
    "Аудит по Безопасности пищи New",
    "тест",
    "Тестовый",
    "Практики работы с Людьми 2026",
    "Поддерживающие визиты ПУСК",
    "Бизнес-планирование",
    "Визит по Управлению Предприятиями на Высоком Уровне",
  ];

  const PBO_VISIT_ROWS = [
    { name: "29779 Озёрная" },
    { name: "26511 Лакинск" },
    { name: "23431 Владивосток Набережная" },
    { name: "26051 Батайск Парк" },
    { name: "29188 Твид Молл" },
    { name: "3333333 Test Hub" },
  ];

  // mock stats per checklist key
  const PBO_VISIT_STATS = {
    "Аудит по Безопасности пищи New": {
      rows: [
        { mark: "dot", pct: "0%" },
        { mark: "dot", pct: "0%" },
        { mark: "dot", pct: "0%" },
        { mark: "dot", pct: "0%" },
        { mark: "dot", pct: "0%" },
        { mark: "dot", pct: "0%" },
      ],
      totalVisit: "0%",
      totalCycle: "0%",
    },
    тест: {
      rows: [
        { mark: "ok", pct: "82%" },
        { mark: "ok", pct: "76%" },
        { mark: "dot", pct: "0%" },
        { mark: "ok", pct: "91%" },
        { mark: "dot", pct: "0%" },
        { mark: "ok", pct: "88%" },
      ],
      totalVisit: "56%",
      totalCycle: "56%",
    },
    Тестовый: {
      rows: [
        { mark: "ok", pct: "100%" },
        { mark: "ok", pct: "100%" },
        { mark: "ok", pct: "64%" },
        { mark: "dot", pct: "0%" },
        { mark: "ok", pct: "72%" },
        { mark: "ok", pct: "95%" },
      ],
      totalVisit: "72%",
      totalCycle: "72%",
    },
  };

  let TASKS = [
    {
      id: "form-food",
      name: "Ознакомьтесь с информацией о прохождении чек-листа Аудит по Безопасности пищи New",
      sub: "Прохождение чек-листа",
      author: "Администратор ПКВ",
      date: "22 сентября 2026 г., 12:36",
      screen: "agreement-food",
    },
    {
      id: "form-hlm",
      name: "Заполнить форму Визит по Управлению Предприятиями на Высоком Уровне для ПБО 3333333 Test Hub",
      sub: "Прохождение чек-листа",
      author: "Администратор ПКВ",
      date: "22 сентября 2026 г., 12:36",
      screen: "form-support",
    },
    {
      id: "agree-support",
      name: "Ознакомьтесь с информацией о прохождении чек-листа Поддерживающие визиты ПУСК",
      sub: "Прохождение чек-листа",
      author: "Администратор ПКВ",
      date: "22 сентября 2026 г., 12:36",
      screen: "agreement",
    },
    {
      id: "results-people",
      name: "Ознакомиться с результатами Практики работы с Людьми 2026 в ПБО 3333333 Test Hub от 20.08.2026",
      sub: "Формирование результата",
      author: "Рычков тест 2",
      date: "02 сентября 2026 г., 14:12",
      screen: "results",
    },
  ];

  TASKS.splice(1, 0, {id:"repeat-people",name:"Провести повторный визит Практики работы с Людьми 2026 в ПБО 3333333 Test Hub",sub:"Регулирование визитов",author:"Администратор ПКВ",date:"22 сентября 2026 г., 12:36",due:"29 сентября 2026 г., 03:00",screen:"results"});

  const state = {
    visitStarted:false, groupIdx:0,
    visitPbo: "3333333 Test Hub",
    visitDate: "22.09.2026",
    photos: {},
    reportFilter: "",
    metaReturn: "modal",
    screen: "dashboard",
    checklist: "Аудит по Безопасности пищи New",
    pendingAfterSkeleton: null,
    returnFromSearch: "modal",
    reportPboReturn: "reports",
    previewIdx: 0,
    foodCatIdx: 0,
    answers: {},
    reasons: {},
    comments: {},
    foodDone: false,
    processFinished: false,
    foodAgreed: false,
    foodDraftDate: "22 сентября 2026 г., 12:36",
    pboVisitChecklist: "Аудит по Безопасности пищи New",
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function allQuestions() {
    const list = [];
    FOOD_CATS.forEach((cat, ci) => {
      cat.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          list.push({ ...q, catIdx: ci, catKey: cat.key, catLabel: cat.label });
        });
      });
    });
    return list;
  }

  function go(name) {
    if(name==='visit-home')renderVisitHome();
    if(name==='visit-overview')renderOverview();
    state.screen = name;
    hideToast();
    if (["results-food", "pdf-food"].includes(name)) renderReport();
    if (name === "form-food" && state.foodDone) { go("results-food"); return; }
    $$(".screen").forEach((el) => {
      el.classList.toggle("active", el.dataset.screen === name);
    });
    if (name === "tasks") renderTasks();
    if (name === "pbo-search") renderPboSearch();
    if (name === "checklist-preview") renderPreview();
    if (name === "form-food") renderFoodForm();
    if (name === "reports") renderReportsPboList();
    if (name === "report-pbo") renderPboVisits();
    if (name === "report-ipur") renderIpurPboList();
    if (name === "visit-search") renderVisitSearch();
    if (name === "checklist-search") renderChecklistSearch();
    if (name === "report-pbo-search") renderReportPboSearch();
  }

  function renderReportsPboList(filter = "") {
    const el = $("#reports-pbo-list");
    if (!el) return;
    const q = (filter || state.reportFilter).trim().toLowerCase();
    el.innerHTML = REPORT_PBOS.filter((p) => !q || p.name.toLowerCase().includes(q))
      .map(
        (p) =>
          `<div class="pbo-link" data-go="pbo-card" data-pbo="${p.name.replace(/"/g, "&quot;")}">${p.name}</div>`
      )
      .join("");
  }

  function renderIpurPboList() {
    const el = $("#ipur-pbo-list");
    if (!el) return;
    el.innerHTML = REPORT_PBOS.slice(0, 8)
      .map(
        (p) =>
          `<div class="pbo-link" data-go="pbo-card" data-pbo="${p.name.replace(/"/g, "&quot;")}">${p.name}</div>`
      )
      .join("");
  }

  function renderVisitSearch(filter = "") {
    const q = filter.trim().toLowerCase();
    const rows = VISIT_OPTIONS.filter((v) => !q || v.name.toLowerCase().includes(q));
    $("#visit-search-body").innerHTML = rows
      .map(
        (v) => `
      <tr data-action="pick-visit" data-visit="${v.name.replace(/"/g, "&quot;")}">
        <td class="linkish">${v.name}</td>
        <td>${v.start}</td>
      </tr>`
      )
      .join("");
  }

  function renderChecklistSearch(filter = "") {
    const q = filter.trim().toLowerCase();
    $("#checklist-search-body").innerHTML = CHECKLIST_OPTIONS.filter(
      (c) => !q || c.toLowerCase().includes(q)
    )
      .map(
        (c) => `
      <tr data-action="pick-checklist" data-checklist="${c.replace(/"/g, "&quot;")}">
        <td class="linkish">${c}</td>
      </tr>`
      )
      .join("");
  }

  function renderReportPboSearch(filter = "") {
    const q = filter.trim().toLowerCase();
    $("#report-pbo-search-body").innerHTML = REPORT_PBOS.filter(
      (p) => !q || p.name.toLowerCase().includes(q)
    )
      .map(
        (p) => `
      <tr data-action="pick-report-pbo" data-pbo="${p.name.replace(/"/g, "&quot;")}">
        <td><input type="checkbox" /></td>
        <td class="linkish">${p.name}</td>
        <td class="loading">${p.legal}</td>
      </tr>`
      )
      .join("");
  }

  function renderPboVisits() {
    const key = state.pboVisitChecklist;
    const stats = PBO_VISIT_STATS[key] || PBO_VISIT_STATS["Аудит по Безопасности пищи New"];
    $("#pbo-visit-checklist").value = key;
    $("#pbo-visits-body").innerHTML =
      PBO_VISIT_ROWS.map((row, i) => {
        const s = stats.rows[i] || { mark: "dot", pct: "0%" };
        const mark =
          s.mark === "ok" ? `<span class="mark-ok">✓</span>` : `<span class="mark-dot"></span>`;
        return `<tr>
          <td class="sticky-col">${row.name}</td>
          <td>${mark}</td>
          <td>${s.pct}</td>
        </tr>`;
      }).join("") +
      `<tr class="total-row">
        <td class="sticky-col total-label">Итого по визиту</td>
        <td>${stats.totalVisit}</td>
        <td>${stats.totalCycle}</td>
      </tr>`;
  }

  function openMenu() {
    $("#menu").hidden = false;
  }
  function closeMenu() {
    $("#menu").hidden = true;
  }

  function openModal() {
    $("#modal-fill-info").hidden = false;
  }
  function closeModal() {
    $("#modal-fill-info").hidden = true;
  }

  function renderTasks() {
    const body = $("#tasks-body");
    body.innerHTML = TASKS.map(
      (t) => `
      <tr data-task="${t.id}" data-go-task="${t.screen}">
        <td>
          <button class="task-open" data-task="${t.id}" data-go-task="${t.screen}">${t.name}</button>
          <div class="task-sub">${t.sub}</div>
        </td>
        <td data-label="Сделать до">${t.due || ""}</td>
        <td data-label="Автор">${t.author}</td>
        <td data-label="Создано">${t.date}</td>
      </tr>`
    ).join("");
  }

  function renderPboSearch(filter = "") {
    const q = filter.trim().toLowerCase();
    const rows = PBOS.filter((p) => !q || p.name.toLowerCase().includes(q));
    $("#pbo-search-body").innerHTML = rows.map(p => `<tr><td><button class="pbo-pick" data-action="pick-pbo" data-pbo="${escapeHtml(p.name)}">${escapeHtml(p.name)}</button><details class="pbo-details-toggle"><summary>Сведения о ПБО</summary>${p.legal.includes('загружается') ? 'Дополнительные сведения в прототипе не представлены.' : escapeHtml(p.legal)}</details></td></tr>`).join('');
    let empty = $('#pbo-empty');
    if (!empty) { empty=document.createElement('p');empty.id='pbo-empty';empty.className='empty-state';$('#pbo-search-body').closest('table').after(empty); }
    empty.textContent='Ничего не найдено. Проверьте номер или название ПБО.';
    empty.hidden=!!rows.length;
  }

  function renderPreview() {
    const sections = FOOD_CATS.flatMap(c => c.sections);
    const sec = sections[state.previewIdx % sections.length];
    $('#preview-section-title').textContent=sec.name;
    $('#preview-cat-pill').textContent=sec.name;
    $('#checklist-preview-body').innerHTML=`<div class="cp-section">${sec.name}</div>`+sec.questions.map(q=>`<div class="cp-row"><div><strong>${q.label}</strong> ${q.text}</div><div>${escapeHtml(state.answers[q.id] || '—')}</div></div>`).join('');
  }

  function unanswered() {
    return allQuestions().filter((q) => !state.answers[q.id]);
  }

  function qLabel(q) {
    return q.label || q.id;
  }

  let validationAttempted = false;
  let lastMissingId = null;
  function renderValidation(show) {
    const box=$('#food-validation'), miss=unanswered();
    box.hidden=!show || !miss.length;
    box.innerHTML=box.hidden ? '' : `<p><strong>Осталось ответить: ${miss.length}</strong></p><button data-action="next-missing">Перейти к следующему пропуску</button>`;
  }
  function updateProposalState() {
    const all=allQuestions(), filled=all.length-unanswered().length;
    const g=groups()[state.groupIdx] || groups()[0];
    $('#proposal-nav').innerHTML=`<div class="group-caption"><span>${g.catIdx===1?'Критические':'Некритические'} · блок ${state.groupIdx+1}/${groups().length}</span><span>${filled}/${all.length}</span></div><div class="progress-track"><span style="width:${filled/all.length*100}%"></span></div><div class="save-status" role="status">${saveStatus}</div>`;
    $$('#food-form-body .audit-green').forEach(el=>{
      const missing=validationAttempted&&!state.answers[el.dataset.qid];
      el.classList.toggle('has-error',missing);
      el.querySelectorAll('input[type=radio]').forEach(r=>r.setAttribute('aria-invalid',String(missing)));
      let hint=el.querySelector('.inline-missing');
      if(missing&&!hint){hint=document.createElement('p');hint.className='inline-missing';hint.textContent='Выберите ответ';el.querySelector('.q-opts').before(hint);}
      if(!missing&&hint)hint.remove();
    });
    renderValidation(validationAttempted);
    persistVisit();
  }
  function renderReview() {
    const all=allQuestions();
    const counts=all.reduce((acc,q)=>{const a=state.answers[q.id];acc[a]=(acc[a]||0)+1;return acc;},{});
    $('#review-food-body').innerHTML=`<div class="review-card"><h2>Все ${all.length} вопросов заполнены</h2><p>${escapeHtml(state.visitPbo)}</p><p>${escapeHtml(state.visitDate)}</p><p class="review-muted">Проверьте ответы перед окончательным завершением визита.</p></div><div class="review-card"><h3>Ответы</h3>${Object.entries(counts).map(([a,n])=>`<p>${escapeHtml(a)} — ${n}</p>`).join('')}<p class="review-muted">Проверьте отмеченные нарушения перед завершением визита.</p></div>${FOOD_CATS.map((c,i)=>`<div class="review-card"><h3>${i===0?'Некритические вопросы':'Критические вопросы'}</h3><p>${all.filter(q=>q.catIdx===i).length} вопросов заполнено</p><button class="btn btn-outline-blue" data-action="review-edit" data-index="${i}">Проверить ответы</button></div>`).join('')}<p class="review-muted">На следующем шаге укажите факт фальсификации и подтвердите завершение. После подтверждения ответы будут недоступны для редактирования.</p>`;
  }

  function whySelectHtml(q, showWhy) {
    if (!q.why) return '';
    const selected = state.reasons[q.id] || [];
    return `<div class="q-why" ${showWhy ? '' : 'hidden'}><div class="why-checks">${q.why.map((w,i) => `<label><input type="checkbox" data-action="reason-check" data-qid="${q.id}" value="${escapeHtml(w)}" ${selected.includes(w) ? 'checked' : ''}>${escapeHtml(w)}</label>`).join('')}</div></div>`;
  }

  function snapshotFoodFormDom() {
    $$('#food-form-body textarea.comment-box').forEach(el => { state.comments[el.dataset.qid] = el.value; });
  }

  function renderFoodForm() {
    snapshotFoodFormDom();
    const group=groups()[state.groupIdx] || groups()[0];
    state.foodCatIdx=group.catIdx;
    const cat = {...FOOD_CATS[group.catIdx],sections:[{name:group.name,questions:group.questions}]};
    $('#food-cat-pill').textContent = cat.label;
    $('#food-cat-pill').title = cat.label;
    for (const action of ['first','prev']) $(`[data-action="food-cat-${action}"]`).disabled = state.foodCatIdx === 0;
    for (const action of ['next','last']) $(`[data-action="food-cat-${action}"]`).disabled = state.foodCatIdx === FOOD_CATS.length-1;
    $('#food-form-body').innerHTML = `<div class="food-cat-heading">${cat.label}</div>` + cat.sections.map(sec => `<section class="food-section"><div class="sec-title">${sec.name}</div>${sec.questions.map(q => {
      const answer = state.answers[q.id] || '';
      return `<div class="audit-green" data-qid="${q.id}"><div class="q-code ${q.critical ? 'critical' : ''}">${q.label}</div><div class="q-text">${q.text}</div>
        ${q.additional ? '<button class="additional-info" disabled title="Содержание закрытого блока не видно в записи">ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ ﹀</button>' : ''}
        <div class="q-opts">${q.options.map(o => `<label><input type="radio" name="${q.id}" value="${escapeHtml(o)}" data-action="answer-q" data-qid="${q.id}" ${answer === o ? 'checked' : ''}>${o}</label>`).join('')}</div>
        ${whySelectHtml(q, answer === 'Нет')}
        <details class="comment-details" ${state.comments[q.id] ? 'open' : ''}><summary>Комментарий${state.comments[q.id] ? ' · добавлен' : ''}</summary><label class="white-label" for="comment-${q.id}">Комментарий</label><textarea id="comment-${q.id}" class="comment-box" data-qid="${q.id}" rows="4">${escapeHtml(state.comments[q.id] || '')}</textarea></details>
        ${q.why ? `<div class="photo-area" ${answer === 'Нет' ? '' : 'hidden'}><label class="photo-button">Прикрепить фотоподтверждение<input type="file" accept="image/*" data-photo="${q.id}" hidden></label><div class="photo-files">${state.photos[q.id] ? `<img class="photo-preview" src="${state.photos[q.id]}" alt="Фотоподтверждение">` : ''}</div></div>` : ''}
      </div>`;
    }).join('')}</section>`).join('');
    updateProposalState();
  }

  function jumpToQuestion(qid) {
    const q = allQuestions().find((x) => x.id === qid);
    if (!q) return;
    state.foodCatIdx = q.catIdx;
    state.groupIdx=groups().findIndex(g=>g.questions.some(x=>x.id===qid));
    go('form-food');
    renderFoodForm();
    requestAnimationFrame(() => {
      const el = document.querySelector(`.audit-green[data-qid="${qid}"]`);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); el.querySelector("input[type=radio]")?.focus({preventScroll:true}); }
    });
  }

  function showToast(text) {
    let toast = $("#tasks-toast");
    if (!toast || !$('[data-screen="tasks"]').classList.contains("active")) {
      toast = $("#global-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "global-toast";
        toast.className = "toast success global-toast";
        toast.innerHTML =
          '<span class="toast-check">✓</span><div><div id="global-toast-text"></div><strong>Готово</strong></div><button class="toast-x" data-action="hide-toast">×</button>';
        $("#app").appendChild(toast);
      }
      $("#global-toast-text").textContent = text;
      toast.hidden = false;
      return;
    }
    $("#toast-text").textContent = text;
    toast.hidden = false;
  }
  function hideToast() {
    const t1 = $("#tasks-toast");
    if (t1) t1.hidden = true;
    const t2 = $("#global-toast");
    if (t2) t2.hidden = true;
  }

  function runSkeletonThen(next, toastText) {
    state.pendingAfterSkeleton = next;
    if (toastText) {
      $("#skeleton-toast-text").textContent = toastText;
      $("#skeleton-toast").hidden = false;
    } else {
      $("#skeleton-toast").hidden = true;
    }
    go("skeleton");
    setTimeout(() => {
      const target = state.pendingAfterSkeleton || "tasks";
      state.pendingAfterSkeleton = null;
      if (target === "form-food") markFoodAgreed();
      go(target);
      if (toastText && target === "tasks") showToast(toastText);
    }, 900);
  }

  function upsertFoodFillTask(opts = {}) {
    const existing = TASKS.find((t) => t.id === "form-food");
    const screen = opts.screen || (state.foodAgreed ? "form-food" : "agreement-food");
    const sub = opts.sub || (state.foodAgreed ? "Черновик — продолжить заполнение" : "Прохождение чек-листа");
    const date = state.foodDraftDate;
    if (existing) {
      existing.name = state.foodAgreed ? `Заполнить форму Аудит по Безопасности пищи New для ПБО ${state.visitPbo}` : 'Ознакомьтесь с информацией о прохождении чек-листа Аудит по Безопасности пищи New';
      existing.screen = screen;
      existing.sub = sub;
      // дата создания той же задачи не меняется
      existing.date = existing.date || date;
      return existing;
    }
    const task = {
      id: "form-food",
      name: state.foodAgreed ? `Заполнить форму Аудит по Безопасности пищи New для ПБО ${state.visitPbo}` : "Ознакомьтесь с информацией о прохождении чек-листа Аудит по Безопасности пищи New",
      sub,
      author: "Администратор ПКВ",
      date,
      screen,
    };
    TASKS.unshift(task);
    return task;
  }

  function markFoodAgreed() {
    state.foodAgreed = true;
    upsertFoodFillTask({ screen: "form-food", sub: "Прохождение чек-листа" });
  }

  function saveFoodDraft() {
    snapshotFoodFormDom();
    state.foodAgreed = true;
    upsertFoodFillTask({
      screen: "form-food",
      sub: "Прохождение чек-листа",
    });
    go("tasks");
    showToast("Сохранить. Задача");
  }

  function openFoodDraft() {
    // продолжаем ту же сохранённую форму, без NDA и без сброса ответов
    if (state.foodAgreed) {
      renderValidation(false);
      runSkeletonThen("visit-overview", "");
      return;
    }
    runSkeletonThen("agreement-food", "");
  }

  function finishFoodAudit() {
    snapshotFoodFormDom();
    validationAttempted = true;
    updateProposalState();
    const miss = unanswered();
    if(miss.length){jumpToQuestion(miss[0].id);return;}
    // как в приложении: список ошибок пересчитывается только при нажатии
    renderValidation(!!miss.length);
    if (miss.length) {
      const first = miss[0];
      if (state.foodCatIdx !== first.catIdx) {
        state.foodCatIdx = first.catIdx;
        renderFoodForm();
      }
      const box = $("#food-validation");
      if (box) box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    renderReview();
    go('review-food');
  }

// Additional states follow the 22 September recording; no cross-variant dependencies.
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function relatedBlocks() {
    return `<div class="related-blocks"><details open><summary>Связанный элемент</summary><button class="text-link" data-action="view-related-checklist">♧ Аудит по Безопасности пищи Ne...</button></details><details open><summary>Напоминания</summary><button class="btn btn-outline-blue" data-action="reminder">+ Напоминание</button></details><details open><summary>Лента <span>⌃　⟳</span></summary><input class="msg-input" placeholder="Сообщение" aria-label="Сообщение" /></details></div>`;
  }

  function openCalendar() {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec($('#visit-date').value);
    state.calendarYear = match ? Number(match[3]) : 2026;
    state.calendarMonth = match ? Number(match[2]) - 1 : 8;
    closeModal();
    go('calendar');
    renderCalendar();
  }

  function renderCalendar() {
    const y = state.calendarYear, m = state.calendarMonth;
    $('#calendar-month').textContent = new Date(y, m, 1).toLocaleDateString('ru-RU', {month:'long',year:'numeric'});
    const offset = (new Date(y,m,1).getDay() + 6) % 7;
    const days = new Date(y,m+1,0).getDate();
    $('#calendar-days').innerHTML = Array.from({length:offset}, () => '<span></span>').join('') +
      Array.from({length:days}, (_,i) => {
        const val = `${String(i+1).padStart(2,'0')}.${String(m+1).padStart(2,'0')}.${y}`;
        return `<button class="${val === $('#visit-date').value ? 'selected' : ''}" data-action="calendar-day" data-value="${val}">${i+1}</button>`;
      }).join('');
  }

  function confirmFoodAudit() {
    if (!state.foodAgreed || state.foodDone || unanswered().length) return;
    const answer = $('input[name="falsification"]:checked');
    if (!answer) { $('#falsification-error').hidden = false; return; }
    state.falsification = answer.value;
    state.foodDone = true;
    state.foodCompletedAt = new Date().toISOString();
    $('#finish-confirm').hidden = true;
    TASKS = TASKS.filter(t => t.id !== 'form-food');
    persistVisit();go('tasks');
    setTimeout(() => {
      TASKS.unshift({id:'results-food',name:`Ознакомиться с результатами Аудит по Безопасности пищи New в ПБО ${state.visitPbo} от ${state.visitDate}`,sub:'Формирование результата',author:'Администратор ПКВ',date:state.foodDraftDate,screen:'results-food'});
      if (state.screen === 'tasks') renderTasks();
      hideToast();
    }, 900);
  }

  function startFoodVisit() {
    const pbo = $('#visit-pbo').value.trim(), date = $('#visit-date').value.trim();
    if (!pbo || !/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
      $('#visit-required').hidden = false;
      return;
    }
    // Only the recorded audit has a reconstructed full questionnaire.
    if (!state.checklist.includes('Безопасности')) {
      closeModal(); go('tasks');
      showToast('Выбранный чек-лист доступен в списке задач');
      return;
    }
    $('#visit-required').hidden = true;
    if (state.foodDone || state.visitPbo !== pbo || state.visitDate !== date) {
      state.answers = {}; state.reasons = {}; state.comments = {}; state.photos = {};
      state.foodAgreed = false; state.foodDone = false; state.processFinished = false; state.falsification = null;
      state.foodCatIdx = 0;state.groupIdx=0;
      $("#food-form-body").innerHTML = "";
      validationAttempted=false;lastMissingId=null;
      renderValidation(false);
      TASKS = TASKS.filter(t => !['form-food','results-food'].includes(t.id));
    }
    state.visitPbo = pbo; state.visitDate = date;
    upsertFoodFillTask({screen:state.foodAgreed ? 'form-food' : 'agreement-food',sub:'Прохождение чек-листа'});
    state.visitStarted=true;persistVisit();closeModal();go('tasks');showToast('Задача создана');setTimeout(hideToast,1600);
  }

  function renderReport() {
    const rows = [];
    FOOD_CATS.forEach(cat => cat.sections.forEach(sec => sec.questions.forEach(q => rows.push({...q,section:sec.name}))));
    const filename = `Отчет по визиту в ПБО ${state.visitPbo} от ${state.visitDate}.pdf`;
    const pages = [];
    for (let i=0; i<5; i++) {
      let last = '';
      const chunk = rows.slice(i*10,(i+1)*10);
      const content = chunk.map(q => {
        const heading = last !== q.section ? `<tr class="report-section"><th colspan="4">${escapeHtml(q.section)}</th></tr>` : '';
        last = q.section;
        return `${heading}<tr><td>${escapeHtml(q.label)}</td><td>${escapeHtml(q.text)}</td><td class="${state.answers[q.id] === 'Нет' ? 'bad' : ''}">${escapeHtml(state.answers[q.id] || '—')}</td><td>${escapeHtml(state.answers[q.id] === 'Нет' ? (state.reasons[q.id] || []).join('; ') : '')}${state.comments[q.id] ? `<br>${escapeHtml(state.comments[q.id])}` : ''}</td></tr>`;
      }).join('');
      const meta = i === 0 ? `<h4>Замечания</h4><div class="report-band">Аудит по Безопасности пищи New</div><div class="report-band">Полный отчет</div><table><tr><td>Дата визита</td><td>${escapeHtml(state.visitDate)}</td></tr><tr><td>ПБО</td><td>${escapeHtml(state.visitPbo)}</td></tr><tr><td>Факт фальсификации</td><td>${escapeHtml(state.falsification || 'Нет')}</td></tr></table>` : '';
      pages.push(`<article class="report-sheet" data-page="${i+1}">${meta}<table><thead><tr><th>№</th><th>Показатель</th><th>Ответ</th><th>Комментарий / причины</th></tr></thead><tbody>${content}</tbody></table><footer>${i+1} / 5</footer></article>`);
    }
    const viewer = () => `<div class="report-viewer"><div class="report-pages">${pages.join('')}</div><div class="report-controls"><span>Страница: <b class="report-page-number">1</b> / 5</span><div><button data-action="report-zoom-out" aria-label="Уменьшить">−</button><button data-action="report-zoom-in" aria-label="Увеличить">⌕</button><button data-action="report-reset" aria-label="Сбросить масштаб">⟳</button></div></div></div>`;
    for(const screen of ['results-food','pdf-food']) {
      const host = $(`[data-screen="${screen}"] .report-host`);
      host.innerHTML = viewer();
      $(`[data-screen="${screen}"] .report-name`).textContent = filename;
    }
    $('#full-report-file').innerHTML = `<div class="file-label">Файл</div><button class="text-link file-link" data-action="open-food-document">${escapeHtml(filename)}</button>${viewer()}`;
    $$('.report-viewer').forEach(v => v.addEventListener('scroll', () => {
      const sheets = [...v.querySelectorAll('.report-sheet')];
      const top = v.getBoundingClientRect().top;
      const nearest = sheets.reduce((a,b) => Math.abs(a.getBoundingClientRect().top-top) < Math.abs(b.getBoundingClientRect().top-top) ? a : b);
      v.querySelector('.report-page-number').textContent = nearest.dataset.page;
    }));
  }

  function renderPboDetails(name) {
    $('#pbo-card-title').textContent = name;
    const known = name === '3333333 Test Hub';
    const fields = known ? [
      ['Наименование ПБО','Test Hub'],['Номер ПБО','3 333 333'],['Юридическое лицо','ООО "Система ПБО"'],['Район','Район КПП Иванова Вера'],['Адрес','рычков тест 3'],['Дата открытия','29 апреля 2026 г.'],['Дата закрытия',''],['Директор','рычков тест 3 рычков тест 3'],['МПП','рычков тест 6 рычков тест 6'],['КПП','Рычков тест 2'],['ДПП','рычков тест 7 рычков тест 7'],['Региональный HR BP',''],['IPUR','Нет'],['Дата постановки на IPUR','']
    ] : [['Наименование ПБО',name],['Номер ПБО',name.split(' ')[0]]];
    $('#pbo-details').innerHTML = fields.map(([k,v]) => `<div class="pbo-detail"><label>${escapeHtml(k)}</label><div>${escapeHtml(v)}</div></div>`).join('');
  }

  function extraAction(action,t) {
    if(action==='workspace-new'){state.checklist='Аудит по Безопасности пищи New';$('#checklist-link').textContent=state.checklist;go('visit-entry');openModal();}
    if(action==='workspace-continue')go(state.foodDone?'results-food':state.foodAgreed?'form-food':'agreement-food');
    if(action==='open-group'){state.groupIdx=Number(t.dataset.index);go('form-food');$('#food-scroll').scrollTop=0;persistVisit();}
    if(action==='group-next'){snapshotFoodFormDom();if(state.groupIdx<groups().length-1){state.groupIdx++;go('form-food');$('#food-scroll').scrollTop=0;}else go('visit-overview');persistVisit();}
    if(action==='workspace-missing'){const q=unanswered()[0];if(q)jumpToQuestion(q.id);}
    if(action==='workspace-reset'){if(window.confirm('Удалить черновик X3 и начать заново?')){state.visitStarted=false;localStorage.removeItem(STORAGE_KEY);location.reload();}}

    if (action === 'calendar-open') openCalendar();
    if (action === 'calendar-prev' || action === 'calendar-next') {
      const date = new Date(state.calendarYear,state.calendarMonth+(action === 'calendar-prev' ? -1 : 1),1);
      state.calendarYear=date.getFullYear(); state.calendarMonth=date.getMonth(); renderCalendar();
    }
    if (action === 'calendar-day' || action === 'calendar-today') {
      $('#visit-date').value=action === 'calendar-today' ? new Date().toLocaleDateString('ru-RU') : t.dataset.value;
      go('visit-entry'); openModal();
    }
    if (action === 'calendar-close') {go('visit-entry');openModal();}
    if (action === 'confirm-food') confirmFoodAudit();
    if (action === 'cancel-finish') $('#finish-confirm').hidden=true;
    if (action === 'agree-food') {
      markFoodAgreed();persistVisit();go('tasks');showToast('С условиями соглашения ознакомлен и согласен.');setTimeout(hideToast,1600);
    }
    if (action === 'open-food-document') {state.documentReturn=state.screen;go('pdf-food');}
    if (action === 'close-food-document') go(state.documentReturn || 'results-food');
    if (action === 'finish-process-food') {
      state.processFinished=true;persistVisit();
      TASKS=TASKS.filter(x=>x.id!=='results-food');go('tasks');showToast('Процесс завершен');setTimeout(hideToast,1600);
    }
    if (action === 'clear-report-filter') {state.reportFilter='';$('#report-filter-chip').hidden=true;renderReportsPboList();}
    if (action === 'view-related-checklist') {state.metaReturn='form-food';go('checklist-meta');}
    if (action === 'reminder') showToast('Напоминания');
    if (action === 'report-zoom-in' || action === 'report-zoom-out' || action === 'report-reset') {
      const pages=t.closest('.report-viewer').querySelector('.report-pages');
      const current=Number(pages.dataset.zoom || 1);
      const value=action==='report-reset'?1:Math.max(1,Math.min(2,current+(action==='report-zoom-in'?.25:-.25)));
      pages.dataset.zoom=value;pages.style.width=`${value*100}%`;
    }
  }


  document.addEventListener("click", (e) => {
    const t = e.target.closest(
      "[data-action], [data-go], [data-open-modal], [data-go-task]"
    );
    if (!t) return;

    if (t.tagName === "A" && t.dataset.action) e.preventDefault();

    const action = t.dataset.action;
    extraAction(action,t);

    if (action === "open-menu") openMenu();
    if (action === "close-menu") closeMenu();
    if (action === "close-modal") closeModal();
    if (action === "hide-toast") hideToast();

    if (action === "toggle-group") {
      t.classList.toggle("open");
      const chev = t.querySelector(".chev");
      if (chev) chev.textContent = t.classList.contains("open") ? "⌃" : "⌄";
    }

    if (action === "open-pbo-search") {
      closeModal();
      state.returnFromSearch = "modal";
      $("#pbo-query").value = "";
      go("pbo-search");
    }

    if (action === "close-pbo-search") {
      go("visit-entry");
      openModal();
    }

    if (action === "pick-pbo") {
      $("#visit-pbo").value = t.dataset.pbo;
      go("visit-entry");
      openModal();
    }

    if (action === "open-checklist-meta") {
      e.preventDefault();
      state.metaReturn="modal";
      closeModal();
      go("checklist-meta");
    }

    if (action === "back-to-modal") {
      if (state.metaReturn === "form-food") go("form-food"); else {go("visit-entry");openModal();}
    }

    if (action === "preview-prev") {
      state.previewIdx = (state.previewIdx - 1 + FOOD_CATS.flatMap(c => c.sections).length) % FOOD_CATS.flatMap(c => c.sections).length;
      renderPreview();
    }
    if (action === "preview-next") {
      state.previewIdx = (state.previewIdx + 1) % FOOD_CATS.flatMap(c => c.sections).length;
      renderPreview();
    }

    if (action === "food-cat-prev" || action === "food-cat-first") {
      state.foodCatIdx = action === "food-cat-first" ? 0 : Math.max(0, state.foodCatIdx - 1);
      renderFoodForm();
      $("#food-scroll").scrollTop=0;
    }
    if (action === "food-cat-next" || action === "food-cat-last") {
      state.foodCatIdx =
        action === "food-cat-last"
          ? FOOD_CATS.length - 1
          : Math.min(FOOD_CATS.length - 1, state.foodCatIdx + 1);
      renderFoodForm();
      $("#food-scroll").scrollTop=0;
    }

    if (action === "answer-q") {
      const qid = t.dataset.qid;
      state.answers[qid] = t.value;
      const block = t.closest(".audit-green");
      const why = block && block.querySelector(".q-why");
      if (why) why.hidden = t.value !== "Нет";
      const photo = block && block.querySelector(".photo-area");
      if (photo) photo.hidden = t.value !== "Нет";
      updateProposalState();
    }

    if (action === "jump-q") jumpToQuestion(t.dataset.qid);

    if (action === "submit-fill") startFoodVisit();

    if (action === "save-visit" || action === "save-food") {
      if (action === "save-food") {
        saveFoodDraft();
        return;
      }
      go("tasks");
      showToast("Сохранить. Задача");
    }

    if (action === "finish-visit") {
      go("tasks");
      showToast("Завершить визит. Задача");
    }

    if (action === "select-food-cat") { state.foodCatIdx=Number(t.dataset.index);renderFoodForm();$('#food-scroll').scrollTop=0; }
    if (action === "next-missing") {
      const miss=unanswered(); if(miss.length){ const i=miss.findIndex(q=>q.id===lastMissingId);const q=miss[(i+1)%miss.length];lastMissingId=q.id;jumpToQuestion(q.id); }
    }
    if (action === "review-edit") { state.foodCatIdx=Number(t.dataset.index);state.groupIdx=groups().findIndex(g=>g.catIdx===state.foodCatIdx);go('form-food');$('#food-scroll').scrollTop=0; }
    if (action === "review-confirm") { $('#falsification-error').hidden=true;$('#finish-confirm').hidden=false; }
    if (action === "finish-food") finishFoodAudit();

    if (action === "open-visit-search") go("visit-search");
    if (action === "open-checklist-search") go("checklist-search");
    if (action === "open-report-pbo-search") {
      state.reportPboReturn = state.screen === "report-ipur" ? "report-ipur" : "reports";
      go("report-pbo-search");
    }
    if (action === "close-report-pbo-search") go(state.reportPboReturn || "reports");

    if (action === "pick-visit") {
      const name = t.dataset.visit;
      $("#full-visit-value").value = `${name} в ПБО 3333333 Test Hub`;
      renderReport();
      $("#full-report-file").hidden = false;
      go("report-full");
    }

    if (action === "pick-checklist") {
      state.pboVisitChecklist = t.dataset.checklist;
      go("report-pbo");
    }

    if (action === "pick-report-pbo") {
      if(t.dataset.pbo.startsWith('24201')) { go('access-denied'); }
      else {state.reportFilter=t.dataset.pbo;go(state.reportPboReturn || 'reports');$('#report-filter-chip').hidden=false;$('#report-filter-name').textContent=state.reportFilter;renderReportsPboList();}
    }

    if (action === "toast-dl") {
      go(state.screen);
      showToast("Файл сохранён / скачан (заглушка)");
      setTimeout(hideToast, 1600);
    }

    if (t.dataset.openModal) {
      const checklist = t.dataset.checklist;
      if (checklist) {
        state.checklist = checklist;
        $("#checklist-link").textContent = checklist;
      }
      $("#visit-pbo").value = "";
      openModal();
    }

    if (t.dataset.go) {
      const next = t.dataset.go;
      if (t.dataset.pbo && next === "pbo-card") {
        const title = $("#pbo-card-title");
        if (title) renderPboDetails(t.dataset.pbo);
      }
      if (next === "skeleton") {
        runSkeletonThen(t.dataset.next || "tasks", t.dataset.toast || "");
      } else {
        go(next);
      }
      if (action === "close-menu") closeMenu();
    }

    if (t.dataset.goTask) {
      const screen = t.dataset.goTask;
      const taskId = t.dataset.task;
      if (taskId === "form-food" || screen === "agreement-food" || screen === "form-food") {
        openFoodDraft();
        return;
      }
      if (screen === "form-support") {
        runSkeletonThen("form-support", "");
      } else {
        go(screen);
      }
    }
  });

  document.addEventListener("change", (e) => {
    const t = e.target;
    if(t.dataset.action === 'reason-check') {
      const checks = [...t.closest('.why-checks').querySelectorAll('input:checked')];
      state.reasons[t.dataset.qid] = checks.map(x=>x.value);
    }
    if(t.dataset.photo && t.files[0]) {
      const reader = new FileReader(); const qid=t.dataset.photo;
      reader.onload=()=>{state.photos[qid]=reader.result;persistVisit();t.closest('.photo-area').querySelector('.photo-files').innerHTML=`<img class="photo-preview" src="${reader.result}" alt="Фотоподтверждение">`;};
      reader.readAsDataURL(t.files[0]);
    }
    if (t.matches('input[type="radio"][data-action="answer-q"]')) {
      state.answers[t.dataset.qid] = t.value;
      const block = t.closest(".audit-green");
      const why = block && block.querySelector(".q-why");
      if (why) why.hidden = t.value !== "Нет";
      const photo = block && block.querySelector(".photo-area");
      if (photo) photo.hidden = t.value !== "Нет";
    }
    if (t.matches("select.why-select-simple") || t.dataset.action === "reason-q") {
      if (t.dataset.qid) state.reasons[t.dataset.qid] = t.value;
    }
  });

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("textarea.comment-box") && t.dataset.qid) {
      state.comments[t.dataset.qid] = t.value;
    }
  });

  const pboQuery = $("#pbo-query");
  if (pboQuery) {
    pboQuery.addEventListener("input", () => renderPboSearch(pboQuery.value));
  }
  const visitQuery = $("#visit-query");
  if (visitQuery) {
    visitQuery.addEventListener("input", () => renderVisitSearch(visitQuery.value));
  }
  const checklistQuery = $("#checklist-query");
  if (checklistQuery) {
    checklistQuery.addEventListener("input", () => renderChecklistSearch(checklistQuery.value));
  }
  const reportPboQuery = $("#report-pbo-query");
  if (reportPboQuery) {
    reportPboQuery.addEventListener("input", () => renderReportPboSearch(reportPboQuery.value));
  }


  const STORAGE_KEY='pusk:visit-workspace:v1';
  let saveStatus='Черновик сохраняется на этом устройстве';
  function groups(){
    return FOOD_CATS.flatMap((c,catIdx)=>c.sections.flatMap(sec=>{
      const chunks=[];for(let i=0;i<sec.questions.length;i+=4)chunks.push({catIdx,name:sec.name,questions:sec.questions.slice(i,i+4)});return chunks;
    }));
  }
  function persistVisit(){
    if(!state.visitStarted)return;
    snapshotFoodFormDom();
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,visitStarted:true,visitPbo:state.visitPbo,visitDate:state.visitDate,groupIdx:state.groupIdx,answers:state.answers,reasons:state.reasons,comments:state.comments,photos:state.photos,foodAgreed:state.foodAgreed,foodDone:state.foodDone,processFinished:state.processFinished,falsification:state.falsification,foodCompletedAt:state.foodCompletedAt}));saveStatus='Сохранено на этом устройстве';}
    catch(e){saveStatus='Не удалось сохранить на устройстве. Не закрывайте вкладку.';}
    const el=$('.save-status');if(el)el.textContent=saveStatus;
  }
  function renderVisitHome(){
    const n=allQuestions().length-unanswered().length;
    $('#visit-home-body').innerHTML=`<div class="workspace-intro"><span class="eyebrow">БЕЗОПАСНОСТЬ ПИЩИ</span><h2>${state.visitStarted?'Визит под рукой':'Проведём визит'}</h2><p>Проверяйте по порядку или выбирайте нужный раздел. К заполнению можно вернуться позже.</p></div>${state.visitStarted?`<div class="workspace-hero"><span class="status-pill">${state.foodDone?'Завершён':state.foodAgreed?'В работе':'Ознакомление'}</span><h2>${escapeHtml(state.visitPbo)}</h2><p>${escapeHtml(state.visitDate)}</p><div class="big-progress">${n}<span> / 48 ответов</span></div><button class="btn btn-primary" data-action="workspace-continue">${state.foodDone?'Открыть результаты':state.foodAgreed?'Продолжить заполнение':'Ознакомиться с условиями'}</button>${state.foodAgreed&&!state.foodDone?'<button class="btn btn-outline-blue" data-go="visit-overview">Все разделы</button>':''}</div><p class="storage-note">${escapeHtml(saveStatus)}. Черновик доступен в этом браузере.</p><button class="reset-link" data-action="workspace-reset">Удалить визит и начать новый</button>`:`<div class="workspace-hero"><h3>Аудит безопасности пищи</h3><p>48 вопросов · 2 раздела</p><p class="storage-note">По несколько вопросов за шаг. Ответы сохраняются автоматически на этом устройстве.</p><button class="btn btn-primary" data-action="workspace-new">Начать визит</button></div>`}`;
  }
  function renderOverview(){
    snapshotFoodFormDom();persistVisit();
    const miss=unanswered().length;
    $('#visit-overview-body').innerHTML=`<div class="workspace-intro"><h2>${miss?'Осталось '+miss+' вопросов':'Всё заполнено'}</h2><p>${escapeHtml(state.visitPbo)}</p>${miss?'<button class="btn btn-primary" data-action="workspace-missing">К первому пропуску</button>':'<p>Можно проверить ответы и завершить визит.</p>'}</div>${groups().map((g,i)=>{const n=g.questions.filter(q=>state.answers[q.id]).length;return `<button class="group-card" data-action="open-group" data-index="${i}"><span class="group-number">${n===g.questions.length?'✓':i+1}</span><span><small>${g.catIdx===1?'Критические':'Некритические'} · ${g.questions[0].label}–${g.questions.at(-1).label}</small><strong>${g.name}</strong><span>${n} из ${g.questions.length} заполнено</span></span><span>›</span></button>`;}).join('')}`;
  }
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(saved&&saved.version===1&&saved.visitStarted){
      Object.assign(state,saved);state.groupIdx=Math.max(0,Math.min(groups().length-1,Number(saved.groupIdx)||0));
      // Only accept answers that still belong to this questionnaire.
      state.answers=Object.fromEntries(allQuestions().filter(q=>q.options.includes(saved.answers?.[q.id])).map(q=>[q.id,saved.answers[q.id]]));
      saveStatus='Восстановлен сохранённый визит';
    }
  }catch(e){saveStatus='Не удалось прочитать сохранённый визит';}
  if(state.visitStarted){
    if(state.foodDone){
      TASKS=TASKS.filter(t=>!['form-food','results-food'].includes(t.id));
      if(!state.processFinished)TASKS.unshift({id:'results-food',name:`Ознакомиться с результатами Аудит по Безопасности пищи New в ПБО ${state.visitPbo} от ${state.visitDate}`,sub:'Формирование результата',author:'Администратор ПКВ',date:state.foodDraftDate,screen:'results-food'});
    }else upsertFoodFillTask({screen:state.foodAgreed?'form-food':'agreement-food'});
  }
  document.addEventListener('input',e=>{if(e.target.matches('textarea.comment-box'))persistVisit();});
  document.addEventListener('change',e=>{if(e.target.matches('[data-action="answer-q"],[data-action="reason-check"]')){updateProposalState();persistVisit();}});
  document.addEventListener('click',()=>{if(state.visitStarted)persistVisit();});
  renderTasks();
  go("dashboard");
})();


