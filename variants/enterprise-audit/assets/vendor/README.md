# Локальные зависимости PDF только для X3

Приложение не загружает библиотеки или шрифт с CDN во время работы.
Эти файлы принадлежат независимой копии `enterprise-audit`.

- `pdf-lib.min.js`: pdf-lib 1.17.1, из bundled runtime Codex;
  https://github.com/Hopding/pdf-lib. MIT: `pdf-lib-LICENSE.md`.
- `fontkit.umd.min.js`: @pdf-lib/fontkit 1.1.1,
  https://unpkg.com/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js.
  MIT; оригинальное описание и ссылка на лицензию: `fontkit-README.md`.
- `report-font.js`: статический Noto Sans Regular, встроенный как base64
  для работы при прямом открытии HTML без запросов к файловой системе.
  Источник: https://github.com/notofonts/noto-fonts/blob/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf
  Дата копирования: 2026-10-13. SIL Open Font License: `NotoSans-OFL.txt`.

Используется статический TTF. Variable Noto Sans не используется: отдельная
визуальная проверка PDF выявила некорректное отображение глифов его подмножества
в выбранной версии fontkit. После замены проверены текст и рендер PDF.

- `pdfjs.min.js` и `pdfjs.worker.min.js`: PDF.js 3.11.174, локальные копии
  https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js и
  https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js.
  Apache 2.0: `pdfjs-LICENSE.txt`. Рендер принимает только сформированные X3
  байты PDF, внешние документы не загружаются. `isEvalSupported: false`.

Происхождение копии: question-pager, 13.10.2026, source-sha256.json в корне X3.
