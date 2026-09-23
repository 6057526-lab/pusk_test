(() => {
  const PBOS = [
    { name: "3333333 Test Hub", legal: 'ООО "Система ПБО"' },
    { name: "101113 Открытие ПБО в начале месяца «Бизнес-планирование»", legal: "Элемент загружается …" },
    { name: "26051 Батайск Парк", legal: "Элемент загружается …" },
    { name: "26511 Лакинск", legal: "Элемент загружается …" },
    { name: "29779 Озёрная", legal: "Элемент загружается …" },
  ];

  const PREVIEW_SECTIONS = [
    {
      title: "Гигиена и Санитария",
      items: [
        { id: "10.FS", text: "Имеется всё необходимое для мытья рук. Если нет, укажите почему:", ans: "Нет", pts: "5 / 0" },
        { id: "13.FS", text: "Имеется система для обеспечения мытья рук всеми сотрудниками каждый час.", ans: "Нет", pts: "5 / 2" },
        { id: "14.FS", text: "Процедуры по санитарной одежде соблюдаются.", ans: "Нет", pts: "3 / 1" },
      ],
    },
    {
      title: "Предотвращение заражения",
      items: [
        { id: "23.FS", text: "Все помещения (полы, стены, оборудование) чистые. Нет стоячей воды в производственной зоне. Если нет, укажите почему:", ans: "Нет", pts: "5 / 0" },
        { id: "24.FS", text: "Процедуры разделения пищевых и непищевых отходов соблюдаются.", ans: "Нет", pts: "3 / 0" },
      ],
    },
    {
      title: "Общие вопросы",
      items: [
        { id: "41.FS", text: "Все продукты, упаковка, оборудование и химикаты поступают от утверждённых поставщиков.", ans: "Нет", pts: "5 / 0" },
        { id: "42.FS", text: "Менеджеры знают симптомы заболеваний, при которых сотрудник не допускается к работе.", ans: "Нет", pts: "5 / 0" },
      ],
    },
  ];

  const WHY_HANDWASH = [
    "Не течёт вода",
    "Раковина недоступна",
    "Диспенсер пустой",
    "Диспенсер не работает",
    "Нет полотенца",
    "Другое",
  ];

  const FOOD_CATS = [
    {
      key: "noncrit",
      label: "Аудит по Безопасности пищи - некритические вопросы",
      sections: [
        {
          name: "Гигиена и Санитария",
          questions: [
            { id: "10.FS", label: "10. FS", text: "Имеется всё необходимое для мытья рук. Если нет, укажите почему:", options: ["Да", "Нет"], why: WHY_HANDWASH },
            { id: "11.FS", label: "11. FS", text: "Сотрудники моют руки в установленные моменты. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "12.FS", label: "12. FS", text: "Ногти чистые, без лака, короткие. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "13.FS", label: "13. FS", text: "Имеется система для обеспечения мытья рук всеми сотрудниками каждый час. Если нет, укажите почему:", options: ["Да", "Нет", "Частично Да"] },
            { id: "14.FS", label: "14. FS", text: "Процедуры по санитарной одежде соблюдаются. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "15.FS", label: "15. FS", text: "Процедуры личной гигиены соблюдаются. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "16.FS", label: "16. FS", text: "Раны закрыты водонепроницаемым пластырем. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "17.FS", label: "17. FS", text: "Украшения не используются на линии. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "18.FS", label: "18. FS", text: "Перчатки используются корректно. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "19.FS", label: "19. FS", text: "Салфетки для дезинфекции поверхностей доступны. Если нет, укажите почему:", options: ["Да", "Нет"] },
          ],
        },
        {
          name: "Предотвращение заражения",
          questions: [
            { id: "21.FS", label: "21. FS", text: "Разделочные доски и ножи разделены по типам продуктов. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "22.FS", label: "22. FS", text: "Санитарные ведра и тряпки используются по назначению. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "23.FS", label: "23. FS", text: "Все помещения чистые, нет стоячей воды. Если нет, укажите почему:", options: ["Да", "Нет", "Частично Да"] },
            { id: "24.FS", label: "24. FS24", text: "Процедуры разделения пищевых и непищевых отходов соблюдаются. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "25.FS", label: "25. FS25", text: "Зоны хранения сырья и готовой продукции разделены. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "26.FS", label: "26. FS", text: "Продукты для шейков и мороженого списываются по срокам. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "27.FS", label: "27. FS27", text: "Все продукты для шейков и мороженого списаны после истечения срока. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "28.FS", label: "28. FS28", text: "Все процедуры работы с фритюрным маслом соблюдаются. Если нет, укажите почему:", options: ["Да", "Нет"] },
          ],
        },
        {
          name: "Общие вопросы",
          questions: [
            { id: "40.FS", label: "40. FS", text: "Температурные журналы ведутся корректно. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "41.FS", label: "41. FS", text: "Все продукты и оборудование поступают от утверждённых поставщиков. Если нет, укажите почему:", options: ["Да", "Нет", "Неактуально"] },
            { id: "42.FS", label: "42. FS", text: "Менеджеры знают симптомы заболеваний и правила возврата к работе. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "43.FS", label: "43. FS", text: "Химикаты промаркированы и хранятся правильно. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "44.FS", label: "44. FS", text: "График санитарной обработки соблюдается. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "45.FS", label: "45. FS", text: "Температуры горячей линии в норме. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "46.FS", label: "46. FS", text: "Холодная линия соответствует стандартам. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "47.FS", label: "47. FS", text: "Документы аудита доступны на месте. Если нет, укажите почему:", options: ["Да", "Нет"] },
            { id: "48.FS", label: "48. FS", text: "Обучение по безопасности пищи актуально. Если нет, укажите почему:", options: ["Да", "Нет"] },
          ],
        },
      ],
    },
    {
      key: "crit",
      label: "Аудит по Безопасности Пищи - критические вопросы",
      sections: [
        {
          name: "Критические вопросы",
          questions: [
            { id: "1.FS.Критический", label: "1. FS. Критический", text: "ПБО не заражено вредителями (здание и прилегающая территория). Если нет, укажите почему:", options: ["Да", "Нет"], critical: true },
            { id: "2.FS.Критический", label: "2. FS. Критический", text: "Внутренняя температура говяжьих котлет соответствует стандарту. Если нет, укажите почему:", options: ["Да", "Нет"], critical: true },
            { id: "3.FS.Критический", label: "3. FS. Критический", text: "Холодильное оборудование поддерживает требуемые температуры.", options: ["Да", "Нет"], critical: true },
            { id: "4.FS.Критический", label: "4. FS. Критический", text: "Нет перекрёстного заражения сырого и готового продукта.", options: ["Да", "Нет"], critical: true },
            { id: "5.FS.Критический", label: "5. FS. Критический", text: "Химикаты хранятся отдельно от пищевых продуктов.", options: ["Да", "Нет"], critical: true },
            { id: "6.FS.Критический", label: "6. FS. Критический", text: "Менеджер отвечает за соблюдение процедур безопасности пищи.", options: ["Да", "Нет"], critical: true },
            { id: "7.FS.Критический", label: "7. FS. Критический", text: "Индекс правильного заполнения ЕКЛБП за 2 последних полных месяца 80% и выше.", options: ["Да", "Нет", "Неактуально"], critical: true },
            { id: "8.FS.Критический", label: "8. FS. Критический", text: "Отсутствуют просроченные продукты на линии.", options: ["Да", "Нет"], critical: true },
            { id: "9.FS.Критический", label: "9. FS. Критический", text: "Сотрудники с симптомами заболеваний отстранены от работы с пищей.", options: ["Да", "Нет"], critical: true },
          ],
        },
      ],
    },
  ];

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
      name: "Заполнить форму Аудит по Безопасности пищи New } для ПБО 3333333 Test Hub",
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

  const state = {
    screen: "dashboard",
    checklist: "Аудит по Безопасности пищи New",
    pendingAfterSkeleton: null,
    returnFromSearch: "modal",
    reportPboReturn: "reports",
    previewIdx: 1,
    foodCatIdx: 0,
    answers: {},
    reasons: {},
    comments: {},
    foodDone: false,
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
    state.screen = name;
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
    const q = filter.trim().toLowerCase();
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
          <div class="task-name">${t.name}</div>
          <div class="task-sub">${t.sub}</div>
        </td>
        <td></td>
        <td>${t.author}</td>
        <td>${t.date}</td>
      </tr>`
    ).join("");
  }

  function renderPboSearch(filter = "") {
    const q = filter.trim().toLowerCase();
    const rows = PBOS.filter((p) => !q || p.name.toLowerCase().includes(q));
    $("#pbo-search-body").innerHTML = rows
      .map(
        (p) => `
      <tr data-action="pick-pbo" data-pbo="${p.name.replace(/"/g, "&quot;")}">
        <td class="linkish">${p.name}</td>
        <td class="${p.legal.includes("загружается") ? "loading" : "linkish"}">${p.legal}</td>
      </tr>`
      )
      .join("");
  }

  function renderPreview() {
    const sec = PREVIEW_SECTIONS[state.previewIdx];
    $("#preview-section-title").textContent = sec.title;
    $("#preview-cat-pill").textContent = sec.title;
    $("#checklist-preview-body").innerHTML =
      `<div class="cp-section">${sec.title}</div>` +
      sec.items
        .map(
          (it) => `
        <div class="cp-row">
          <div><strong style="color:#1565c0">${it.id}</strong> ${it.text}</div>
          <div class="ans">${it.ans}</div>
          <div class="pts">${it.pts}</div>
        </div>`
        )
        .join("");
  }

  function unanswered() {
    return allQuestions().filter((q) => !state.answers[q.id]);
  }

  function qLabel(q) {
    return q.label || q.id;
  }

  function renderValidation(show) {
    const box = $("#food-validation");
    if (!show) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const miss = unanswered();
    if (!miss.length) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const non = miss.filter((q) => q.catKey === "noncrit");
    const crit = miss.filter((q) => q.catKey === "crit");
    let html = "";
    if (non.length) {
      html += `<p class="v-p">Необходимо ответить на вопросы раздела «Аудит по Безопасности пищи - некритические вопросы»: ${non
        .map((q) => `<span class="v-link" data-action="jump-q" data-qid="${q.id}">${qLabel(q)}</span>`)
        .join("; ")}</p>`;
    }
    if (non.length && crit.length) html += `<hr class="v-sep" />`;
    if (crit.length) {
      html += `<p class="v-p">Необходимо ответить на вопросы раздела «Аудит по Безопасности Пищи - критические вопросы»: ${crit
        .map((q) => `<span class="v-link" data-action="jump-q" data-qid="${q.id}">${qLabel(q)}</span>`)
        .join("; ")}</p>`;
    }
    html += `<hr class="v-sep bottom" />`;
    box.innerHTML = html;
    box.hidden = false;
  }

  function whySelectHtml(q, showWhy) {
    const opts = q.why || [
      "Не течёт вода",
      "Раковина недоступна",
      "Диспенсер пустой",
      "Диспенсер не работает",
      "Нет полотенца",
      "Другое",
    ];
    const selected = state.reasons[q.id] || "";
    return `<div class="q-why" ${showWhy ? "" : "hidden"}>
      <select class="why-select-simple" data-qid="${q.id}" data-action="reason-q">
        <option value="">Выберите</option>
        ${opts
          .map(
            (w) =>
              `<option value="${w.replace(/"/g, "&quot;")}" ${
                selected === w ? "selected" : ""
              }>${w}</option>`
          )
          .join("")}
      </select>
      <div class="photo-stub">📷 Прикрепить фотоподтверждение</div>
    </div>`;
  }

  function snapshotFoodFormDom() {
    $$("#food-form-body textarea.comment-box").forEach((el) => {
      if (el.dataset.qid) state.comments[el.dataset.qid] = el.value;
    });
    $$("#food-form-body select.why-select-simple").forEach((el) => {
      if (el.dataset.qid) state.reasons[el.dataset.qid] = el.value;
    });
  }

  function renderFoodForm() {
    snapshotFoodFormDom();
    const cat = FOOD_CATS[state.foodCatIdx];
    $("#food-cat-pill").textContent = cat.label;
    const body = $("#food-form-body");
    let html = `<div class="food-cat-heading">${cat.label}</div>`;
    cat.sections.forEach((sec) => {
      sec.questions.forEach((q, qi) => {
        const ans = state.answers[q.id] || "";
        const showWhy = ans === "Нет";
        const showSec = qi === 0;
        const comment = state.comments[q.id] || "";
        html += `<div class="audit-green" data-qid="${q.id}">
          ${showSec ? `<div class="sec-title">${sec.name}</div>` : ""}
          <div class="q-code ${q.critical ? "critical" : ""}">${qLabel(q)}</div>
          <div class="q-text">${q.text}</div>
          <div class="q-opts">
            ${q.options
              .map(
                (o) => `<label><input type="radio" name="${q.id}" value="${o}" ${
                  ans === o ? "checked" : ""
                } data-action="answer-q" data-qid="${q.id}" /> ${o}</label>`
              )
              .join("")}
          </div>
          ${whySelectHtml(q, showWhy)}
          <label class="white-label">Комментарий</label>
          <textarea class="comment-box" rows="2" data-qid="${q.id}" data-action="comment-q">${comment.replace(
            /</g,
            "&lt;"
          )}</textarea>
        </div>`;
      });
    });
    body.innerHTML = html;
  }

  function jumpToQuestion(qid) {
    const q = allQuestions().find((x) => x.id === qid);
    if (!q) return;
    state.foodCatIdx = q.catIdx;
    renderFoodForm();
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-qid="${qid}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
      existing.screen = screen;
      existing.sub = sub;
      // дата создания той же задачи не меняется
      existing.date = existing.date || date;
      return existing;
    }
    const task = {
      id: "form-food",
      name: "Заполнить форму Аудит по Безопасности пищи New } для ПБО 3333333 Test Hub",
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
    upsertFoodFillTask({ screen: "form-food", sub: "Черновик — продолжить заполнение" });
  }

  function saveFoodDraft() {
    snapshotFoodFormDom();
    state.foodAgreed = true;
    upsertFoodFillTask({
      screen: "form-food",
      sub: "Черновик — продолжить заполнение",
    });
    go("tasks");
    showToast("Сохранить. Задача");
  }

  function openFoodDraft() {
    // продолжаем ту же сохранённую форму, без NDA и без сброса ответов
    if (state.foodAgreed) {
      renderValidation(false);
      go("form-food");
      return;
    }
    go("agreement-food");
  }

  function finishFoodAudit() {
    const miss = unanswered();
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
    state.foodDone = true;
    TASKS = TASKS.filter((t) => t.id !== "form-food");
    TASKS.unshift({
      id: "results-food",
      name: "Ознакомиться с результатами Аудит по Безопасности пищи New в ПБО 3333333 Test Hub от 22.09.2026",
      sub: "Формирование результата",
      author: "Администратор ПКВ",
      date: "22 сентября 2026 г., 12:36",
      screen: "results-food",
    });
    go("tasks");
    showToast("Завершить визит. Задача");
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest(
      "[data-action], [data-go], [data-open-modal], [data-go-task]"
    );
    if (!t) return;

    if (t.tagName === "A" && t.dataset.action) e.preventDefault();

    const action = t.dataset.action;

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
      closeModal();
      go("checklist-meta");
    }

    if (action === "back-to-modal") {
      go("visit-entry");
      openModal();
    }

    if (action === "preview-prev") {
      state.previewIdx = (state.previewIdx - 1 + PREVIEW_SECTIONS.length) % PREVIEW_SECTIONS.length;
      renderPreview();
    }
    if (action === "preview-next") {
      state.previewIdx = (state.previewIdx + 1) % PREVIEW_SECTIONS.length;
      renderPreview();
    }

    if (action === "food-cat-prev" || action === "food-cat-first") {
      state.foodCatIdx = action === "food-cat-first" ? 0 : Math.max(0, state.foodCatIdx - 1);
      renderFoodForm();
    }
    if (action === "food-cat-next" || action === "food-cat-last") {
      state.foodCatIdx =
        action === "food-cat-last"
          ? FOOD_CATS.length - 1
          : Math.min(FOOD_CATS.length - 1, state.foodCatIdx + 1);
      renderFoodForm();
    }

    if (action === "answer-q") {
      const qid = t.dataset.qid;
      state.answers[qid] = t.value;
      const block = t.closest(".audit-green");
      const why = block && block.querySelector(".q-why");
      if (why) why.hidden = t.value !== "Нет";
      // список ошибок обновляется только по «Завершить визит»
    }

    if (action === "jump-q") jumpToQuestion(t.dataset.qid);

    if (action === "submit-fill") {
      closeModal();
      const isFood = state.checklist.includes("Безопасности");
      if (isFood && !state.foodDone) {
        // уже есть черновик — не создаём «новую» и не сбрасываем согласие/ответы
        if (!TASKS.some((x) => x.id === "form-food")) {
          state.foodAgreed = false;
          state.answers = {};
          state.reasons = {};
          state.comments = {};
          state.foodCatIdx = 0;
          state.foodDraftDate = "22 сентября 2026 г., 12:36";
          upsertFoodFillTask({
            screen: "agreement-food",
            sub: "Прохождение чек-листа",
          });
        } else {
          upsertFoodFillTask({
            screen: state.foodAgreed ? "form-food" : "agreement-food",
            sub: state.foodAgreed
              ? "Черновик — продолжить заполнение"
              : "Прохождение чек-листа",
          });
        }
      }
      go("tasks");
      showToast(
        TASKS.some((x) => x.id === "form-food" && state.foodAgreed)
          ? "Черновик уже есть — продолжите заполнение"
          : "Задача создана"
      );
      setTimeout(hideToast, 1600);
    }

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
      $("#full-report-file").hidden = false;
      go("report-full");
    }

    if (action === "pick-checklist") {
      state.pboVisitChecklist = t.dataset.checklist;
      go("report-pbo");
    }

    if (action === "pick-report-pbo") {
      const title = $("#pbo-card-title");
      if (title) title.textContent = t.dataset.pbo;
      go("pbo-card");
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
        if (title) title.textContent = t.dataset.pbo;
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
    if (t.matches('input[type="radio"][data-action="answer-q"]')) {
      state.answers[t.dataset.qid] = t.value;
      const block = t.closest(".audit-green");
      const why = block && block.querySelector(".q-why");
      if (why) why.hidden = t.value !== "Нет";
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

  renderTasks();
  go("dashboard");
})();
