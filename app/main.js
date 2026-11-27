// Kakeibo app — hash router and all interactivity. State lives in memory;
// every view re-renders from the same transaction list, so pages never disagree.

import { SEED_TRANSACTIONS, GOALS, BILLS, BUDGET_LIMITS } from './data.js';
import { dashboardView, transactionsView, budgetsView, goalsView, billsView, insightsView } from './views.js';

const state = {
  transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
  goals: GOALS.map((g) => ({ ...g })),
  bills: BILLS.map((b) => ({ ...b })),
  goalMonthly: {},
  tipIndex: 0,
  txQuery: '',
  txFilter: 'all',
  nextId: 100,
};

const routes = {
  '/': dashboardView,
  '/transactions': transactionsView,
  '/budgets': budgetsView,
  '/goals': goalsView,
  '/bills': billsView,
  '/insights': insightsView,
};

function currentPath() {
  const hash = location.hash.replace(/^#/, '');
  return routes[hash] ? hash : '/';
}

function render() {
  const path = currentPath();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + path);
  });
  document.getElementById('page').innerHTML = routes[path](state);
  window.scrollTo(0, 0);
  wire(path);
}

function wire(path) {
  if (path === '/transactions') {
    document.getElementById('tx-form').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const form = new FormData(ev.target);
      const amount = Number(form.get('amount'));
      const note = String(form.get('note') || '').trim();
      if (!note || !(amount > 0)) return;
      state.transactions.push({
        id: state.nextId++,
        date: String(form.get('date')),
        type: String(form.get('type')),
        category: String(form.get('category')),
        note, amount,
      });
      render();
      const msg = document.getElementById('tx-msg');
      if (msg) msg.textContent = 'Added. The dashboard and budgets now include it.';
    });
    document.getElementById('tx-search').addEventListener('input', (ev) => {
      state.txQuery = ev.target.value;
      const pos = ev.target.selectionStart;
      render();
      const box = document.getElementById('tx-search');
      box.focus(); box.setSelectionRange(pos, pos);
    });
    document.getElementById('tx-filter').addEventListener('change', (ev) => {
      state.txFilter = ev.target.value; render();
    });
    document.querySelectorAll('[data-del]').forEach((btn) => btn.addEventListener('click', () => {
      state.transactions = state.transactions.filter((t) => t.id !== Number(btn.dataset.del));
      render();
    }));
  }
  if (path === '/budgets') {
    document.querySelectorAll('[data-limit]').forEach((form) => form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const value = Number(new FormData(form).get('limit'));
      if (value >= 0) { BUDGET_LIMITS[form.dataset.limit] = value; render(); }
    }));
  }
  if (path === '/goals') {
    document.querySelectorAll('[data-goal]').forEach((slider) => slider.addEventListener('input', () => {
      state.goalMonthly[slider.dataset.goal] = Number(slider.value); render();
      const again = document.querySelector(`[data-goal="${slider.dataset.goal}"]`);
      if (again) again.focus();
    }));
  }
  if (path === '/bills') {
    document.querySelectorAll('[data-bill]').forEach((box) => box.addEventListener('change', () => {
      const bill = state.bills.find((b) => b.id === Number(box.dataset.bill));
      if (bill) { bill.paid = box.checked; render(); }
    }));
  }
  if (path === '/insights') {
    document.getElementById('next-tip').addEventListener('click', () => { state.tipIndex++; render(); });
  }
}

window.addEventListener('hashchange', render);
render();
