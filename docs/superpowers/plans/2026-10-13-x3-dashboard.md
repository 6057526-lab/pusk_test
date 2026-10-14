# X3 Dashboard Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Implement the user-approved multi-enterprise overview in the existing X3, using honest local data and explicit missing-source states.

**Architecture:** Independent `enterprise-audit` files only. A pure dashboard model selects completed visits and drafts; app.js owns rendering/navigation. The existing `pusk:enterprise-audit:v1` state stores dashboard filters and return context.

**Tech Stack:** Static HTML, CSS, JavaScript; Node built-in tests and browser verification.

**Spec:** `docs/dashboard-analysis-2026-10-13.md`, approved by “Давай внедрим этот раздел”.

## Global Constraints

- X1 and X2 remain unchanged; verify X1 against baseline before and after work.
- No shared mutable assets or new storage keys.
- No invented plan, IPUR, owners, deadlines or remediation status.
- Examples and drafts do not count as completed results; a critical answer is a fact of the latest audit, not an open violation.
- This request implements a local preview; deployment is a separate action.

## Review Focus

- Existing saved visits and filters must survive updates and navigation.
- A newer good result supersedes an older bad result in latest-result metrics.
- Date filters affect completed results; unfinished work remains available across dates.
- Empty sources must say “Нет данных”, not imply 0% or a healthy enterprise.
- Search, period and scroll position must survive opening and returning from an audit.

### Task 1: Data selection

**Files:** Create `variants/enterprise-audit/js/dashboard-data.js` and `tests/dashboard-data.test.cjs`.

**Interfaces:** `build(pbos, visits, summarize, filters)` returns rows, completed count, drafts and critical-site count; `filterRows(rows, {query, status})` filters names/numbers and latest results/drafts.

- [x] Write tests for sample exclusion, newest result, date boundaries, drafts across dates, critical-site counting and search.
- [x] Run and observe missing module failure.
- [x] Implement the pure model and verify tests.

### Task 2: Dashboard and navigation

**Files:** Modify `variants/enterprise-audit/index.html`, `js/app.js`, `css/app.css`, `tests/lifecycle.test.cjs`.

- [x] Load own model; add dashboard state defaults compatible with existing saves.
- [x] Render context, latest-result metrics, unfinished work, missing-source controls, searchable enterprise cards and date filter.
- [x] Open draft/result/enterprise from dashboard; explicit “К обзору ПБО” restores search/filter/scroll. Leave existing audit paths available.
- [x] Check lifecycle suite; add return-context coverage.
- [x] Verify direct X3, shell, populated and empty data, mobile 390/320 and desktop layout, continued question edits, completed results and neighboring variants.

### Task 3: Documentation and review

**Files:** Update `variants/enterprise-audit/README.md`, `design-qa.md`, `docs/prototype-architecture.md`.

- [x] Record actual behavior and data limitations; retain unresolved business rules.
- [x] Review diff, run fresh tests and baseline check, save a screenshot, open local dashboard for the user.

## Completion record
Task 1: missing module RED; data model tests GREEN.
Task 2: local browser checks and lifecycle/context checks complete; suite 18/18.
Final independent review: no unresolved significant findings. Completed-result drill-down fix verified RED to GREEN.
Task 3: docs updated; source baseline PASS, syntax and whitespace checks PASS. Railway not published.
New user request: chart research delivered separately, no chart implementation added to this plan.
