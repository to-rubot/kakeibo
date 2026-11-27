// Kakeibo views — one render function per page, all reached by hash links.

import { CATEGORIES, HOUSEHOLD, MONTH_HISTORY, LAST_MONTH_BY_CATEGORY, TIPS } from './data.js';
import { yen, totalIncome, totalExpense, totalSaved, balance, savingsRate, spentByCategory, budgetStatus, rule503020, safeToSpend, goalProjection, topCategory } from './calc.js';
import { donutChart, trendChart, progressBar } from './charts.js';

const catLabel = (id) => (CATEGORIES.find((c) => c.id === id)?.label ?? (id === 'salary' ? 'Income' : id === 'savings' ? 'Savings' : id));
const catColor = (id) => (CATEGORIES.find((c) => c.id === id)?.color ?? '#94a3b8');
const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

export function dashboardView(state) {
  const tx = state.transactions;
  const income = totalIncome(tx), expense = totalExpense(tx), saved = totalSaved(tx);
  const rate = Math.round(savingsRate(tx) * 100);
  const unpaid = state.bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
  const safe = safeToSpend(tx, unpaid, 4);
  const spent = spentByCategory(tx);
  const donutEntries = CATEGORIES.map((c) => ({ label: c.label, color: c.color, value: spent[c.id] })).filter((e) => e.value > 0);
  const history = MONTH_HISTORY.map((h) => h.month === 'Nov' ? { ...h, expense } : h);
  const alerts = budgetStatus(tx).filter((b) => b.pct >= 0.85);
  const recent = [...tx].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 6);
  return `
  <section class="hero">
    <h1>${HOUSEHOLD.monthLabel} at a glance</h1>
    <p>${HOUSEHOLD.name} — ${HOUSEHOLD.members}. Every figure below is live: add a transaction and this page, the budgets and the insights all move.</p>
  </section>
  <section class="kpis">
    <div class="kpi"><span>Income</span><strong class="pos">${yen(income)}</strong></div>
    <div class="kpi"><span>Spending</span><strong class="neg">${yen(expense)}</strong></div>
    <div class="kpi"><span>Put into savings</span><strong>${yen(saved)}</strong></div>
    <div class="kpi"><span>Left in the pot</span><strong>${yen(balance(tx))}</strong></div>
    <div class="kpi"><span>Savings rate</span><strong>${rate}%</strong></div>
    <div class="kpi accent"><span>Safe to spend (4 days left)</span><strong>${yen(safe.total)}</strong><small>${yen(safe.perDay)} per day, after unpaid bills of ${yen(unpaid)}</small></div>
  </section>
  <section class="grid2">
    <div class="card"><h2>Spending by category</h2><div class="donut-wrap">${donutChart(donutEntries)}
      <ul class="legend">${donutEntries.map((e) => `<li><i style="background:${e.color}"></i>${e.label} <b>${yen(e.value)}</b></li>`).join('')}</ul></div></div>
    <div class="card"><h2>Income vs spending — 6 months</h2>${trendChart(history)}
      <p class="note"><span class="dot g"></span> Income &nbsp; <span class="dot a"></span> Spending. November is this month, counted live.</p></div>
  </section>
  ${alerts.length ? `<section class="card warn"><h2>Budget watch</h2>${alerts.map((b) => `<p>${b.label}: ${yen(b.used)} of ${yen(b.limit)} used (${Math.round(b.pct * 100)}%) ${progressBar(b.pct, b.color)}</p>`).join('')}</section>` : ''}
  <section class="card"><h2>Recent activity — ${tx.length} transactions this month</h2>
    <ul class="txlist">${recent.map((t) => `<li><span class="pill" style="background:${catColor(t.category)}"></span><span class="txnote">${esc(t.note)}</span><span class="txdate">${t.date.slice(5)}</span><b class="${t.type === 'income' ? 'pos' : ''}">${t.type === 'income' ? '+' : '−'}${yen(t.amount)}</b></li>`).join('')}</ul>
    <p><a class="btn" href="#/transactions">Add or edit transactions</a> <a class="btn ghost" href="#/budgets">Check budgets</a></p>
  </section>`;
}

export function transactionsView(state) {
  const q = state.txQuery.toLowerCase(), f = state.txFilter;
  const list = [...state.transactions]
    .filter((t) => (f === 'all' || t.category === f || t.type === f) && t.note.toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const sum = list.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
  return `
  <section class="hero"><h1>Transactions</h1><p>Add what really happened — the dashboard, budgets and insights recalculate from this list.</p></section>
  <section class="card"><h2>Add a transaction</h2>
    <form id="tx-form" class="txform">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Type <select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}<option value="salary">Salary / income</option><option value="savings">Savings transfer</option></select></label>
      <label>Note <input type="text" name="note" placeholder="e.g. Supermarket" required maxlength="60"></label>
      <label>Amount (¥) <input type="number" name="amount" min="1" step="1" placeholder="1200" required></label>
      <button class="btn" type="submit">Add transaction</button>
    </form>
    <p id="tx-msg" class="note" role="status"></p>
  </section>
  <section class="card"><h2>This month (${list.length} shown, net ${yen(sum)})</h2>
    <div class="filters">
      <input id="tx-search" type="search" placeholder="Search notes…" value="${esc(state.txQuery)}" aria-label="Search transactions">
      <select id="tx-filter" aria-label="Filter transactions">
        <option value="all"${f === 'all' ? ' selected' : ''}>All</option>
        <option value="income"${f === 'income' ? ' selected' : ''}>Income only</option>
        <option value="expense"${f === 'expense' ? ' selected' : ''}>Expenses only</option>
        ${CATEGORIES.map((c) => `<option value="${c.id}"${f === c.id ? ' selected' : ''}>${c.label}</option>`).join('')}
      </select>
    </div>
    <ul class="txlist">${list.map((t) => `<li><span class="pill" style="background:${catColor(t.category)}"></span><span class="txnote">${esc(t.note)} <small>· ${catLabel(t.category)}</small></span><span class="txdate">${t.date}</span><b class="${t.type === 'income' ? 'pos' : ''}">${t.type === 'income' ? '+' : '−'}${yen(t.amount)}</b><button class="del" data-del="${t.id}" aria-label="Delete ${esc(t.note)}">×</button></li>`).join('') || '<li>No transactions match.</li>'}</ul>
  </section>`;
}

export function budgetsView(state) {
  const rows = budgetStatus(state.transactions);
  const rule = rule503020(state.transactions);
  const block = (label, part) => `
    <div class="rule"><h3>${label} — ideal ${part.ideal}%</h3>
      <p><strong>${yen(part.value)}</strong> · ${part.pct.toFixed(1)}% of income</p>
      <div class="bar tall"><div class="bar-fill" style="width:${Math.min(100, part.pct).toFixed(1)}%;background:${part.pct <= part.ideal + 5 ? '#16a34a' : '#dc2626'}"></div></div>
      <p class="note">${part.pct <= part.ideal + 5 ? 'On track.' : 'Over the guide — see which category below is pushing it.'}</p></div>`;
  return `
  <section class="hero"><h1>Budgets</h1><p>One envelope per category. Bars turn red past 100%; change a limit and every page agrees.</p></section>
  <section class="card"><h2>Category envelopes — November</h2>
    ${rows.map((b) => `<div class="budget-row"><div class="budget-head"><span><i class="pill" style="background:${b.color}"></i>${b.label}</span><span>${yen(b.used)} / ${yen(b.limit)} · <b class="${b.left < 0 ? 'neg' : 'pos'}">${b.left < 0 ? yen(-b.left) + ' over' : yen(b.left) + ' left'}</b></span></div>
      ${progressBar(b.pct, b.color)}
      <form class="limit-form" data-limit="${b.id}"><label>New limit ¥ <input type="number" name="limit" min="0" step="500" value="${b.limit}"></label><button class="btn small" type="submit">Set limit</button></form></div>`).join('')}
  </section>
  <section class="card"><h2>The 50 / 30 / 20 check</h2>
    <p class="note">A simple guide: 50% of take-home on needs, 30% on wants, 20% saved. This household, live from its transactions:</p>
    <div class="grid3">${block('Needs', rule.needs)}${block('Wants', rule.wants)}${block('Saved & kept', rule.saved)}</div>
  </section>`;
}

export function goalsView(state) {
  return `
  <section class="hero"><h1>Savings goals</h1><p>Named goals get saved for. Move a slider to see when a goal lands if the monthly amount changes.</p></section>
  <section class="grid3">${state.goals.map((g) => {
    const monthly = state.goalMonthly[g.id] ?? g.monthly;
    const p = goalProjection(g, monthly);
    return `<div class="card goal"><h2>${g.label}</h2><p class="note">${g.note}</p>
      <p><strong>${yen(g.saved)}</strong> of ${yen(g.target)} · ${Math.round(p.pct * 100)}%</p>
      ${progressBar(p.pct, '#2563eb')}
      <p>Still to go: <b>${yen(p.remaining)}</b></p>
      <label class="slider">Save per month: <b>${yen(monthly)}</b>
        <input type="range" min="0" max="60000" step="1000" value="${monthly}" data-goal="${g.id}"></label>
      <p class="goal-when">At this pace: <b>${p.months} months</b> — lands <b>${p.whenLabel}</b></p></div>`;
  }).join('')}</section>
  <section class="card"><h2>Why these three?</h2><p>Emergency fund first, because one broken appliance should never become debt. The trip is dated and shared, so it stays motivating. The laptop earns its keep through side work — it is the only goal that pays the household back.</p></section>`;
}

export function billsView(state) {
  const paid = state.bills.filter((b) => b.paid), unpaid = state.bills.filter((b) => !b.paid);
  const sum = (arr) => arr.reduce((s, b) => s + b.amount, 0);
  const cells = [];
  for (let d = 1; d <= 30; d++) {
    const dayBills = state.bills.filter((b) => b.day === d);
    cells.push(`<div class="day${dayBills.length ? ' has' : ''}"><span>${d}</span>${dayBills.map((b) => `<em class="${b.paid ? 'paid' : 'due'}">${esc(b.label.split(' ')[0])} ${yen(b.amount)}</em>`).join('')}</div>`);
  }
  return `
  <section class="hero"><h1>Bills & fixed costs</h1><p>November's fixed calendar. Tick a bill as paid and the dashboard's safe-to-spend figure updates.</p></section>
  <section class="kpis">
    <div class="kpi"><span>Fixed costs total</span><strong>${yen(sum(state.bills))}</strong></div>
    <div class="kpi"><span>Paid</span><strong class="pos">${yen(sum(paid))}</strong></div>
    <div class="kpi"><span>Still due</span><strong class="neg">${yen(sum(unpaid))}</strong></div>
  </section>
  <section class="card"><h2>November 2026</h2><div class="calendar">${cells.join('')}</div></section>
  <section class="card"><h2>Bill list</h2>
    <ul class="txlist">${state.bills.map((b) => `<li><label class="billcheck"><input type="checkbox" data-bill="${b.id}"${b.paid ? ' checked' : ''}> ${esc(b.label)}</label><span class="txdate">Nov ${b.day}</span><b>${yen(b.amount)}</b></li>`).join('')}</ul>
  </section>`;
}

export function insightsView(state) {
  const tx = state.transactions;
  const top = topCategory(tx);
  const spent = spentByCategory(tx);
  const rows = CATEGORIES.map((c) => {
    const now = spent[c.id], before = LAST_MONTH_BY_CATEGORY[c.id];
    const diff = now - before, pct = before ? Math.round((diff / before) * 100) : 0;
    return { label: c.label, color: c.color, now, before, diff, pct };
  }).sort((a, b) => b.now - a.now);
  const tip = TIPS[state.tipIndex % TIPS.length];
  return `
  <section class="hero"><h1>Insights</h1><p>What changed, where the money really goes, and one idea worth acting on.</p></section>
  <section class="kpis">
    <div class="kpi accent"><span>Biggest category</span><strong>${top.label}</strong><small>${yen(top.used)} this month</small></div>
    <div class="kpi"><span>Savings rate</span><strong>${Math.round(savingsRate(tx) * 100)}%</strong><small>Guide: 20% or more</small></div>
    <div class="kpi"><span>Daily average spend</span><strong>${yen(Math.round(totalExpense(tx) / 26))}</strong><small>Over the 26 days so far</small></div>
  </section>
  <section class="card"><h2>November vs October, by category</h2>
    <table class="cmp"><thead><tr><th>Category</th><th>October</th><th>November</th><th>Change</th></tr></thead>
    <tbody>${rows.map((r) => `<tr><td><i class="pill" style="background:${r.color}"></i>${r.label}</td><td>${yen(r.before)}</td><td>${yen(r.now)}</td><td class="${r.diff > 0 ? 'neg' : 'pos'}">${r.diff > 0 ? '+' : ''}${yen(r.diff)} (${r.pct > 0 ? '+' : ''}${r.pct}%)</td></tr>`).join('')}</tbody></table>
    <p class="note">Groceries and dining rose with two family weekends; transport fell because the car stayed home. Nothing here is a surprise — which is the point of looking monthly.</p>
  </section>
  <section class="card tip"><h2>One money idea</h2><p id="tip-text">${tip}</p><button class="btn" id="next-tip" type="button">Show another idea</button></section>`;
}
