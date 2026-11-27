// Kakeibo calculations — pure functions over the transaction list.

import { CATEGORIES, BUDGET_LIMITS } from './data.js';

export function yen(n) {
  return '¥' + Math.round(n).toLocaleString('en-US');
}

export function totalIncome(transactions) {
  return transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
}

export function totalExpense(transactions) {
  return transactions.filter((t) => t.type === 'expense' && t.category !== 'savings')
    .reduce((s, t) => s + t.amount, 0);
}

export function totalSaved(transactions) {
  return transactions.filter((t) => t.category === 'savings').reduce((s, t) => s + t.amount, 0);
}

export function balance(transactions) {
  return totalIncome(transactions) - totalExpense(transactions) - totalSaved(transactions);
}

export function savingsRate(transactions) {
  const income = totalIncome(transactions);
  if (!income) return 0;
  return (totalSaved(transactions) + balance(transactions)) / income;
}

export function spentByCategory(transactions) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of transactions) {
    if (t.type === 'expense' && out[t.category] !== undefined) out[t.category] += t.amount;
  }
  return out;
}

export function budgetStatus(transactions) {
  const spent = spentByCategory(transactions);
  return CATEGORIES.map((c) => {
    const limit = BUDGET_LIMITS[c.id];
    const used = spent[c.id];
    return { ...c, limit, used, left: limit - used, pct: limit ? used / limit : 0 };
  });
}

// 50/30/20 split: needs / wants / savings against take-home income.
export function rule503020(transactions) {
  const income = totalIncome(transactions);
  const spent = spentByCategory(transactions);
  let needs = 0, wants = 0;
  for (const c of CATEGORIES) {
    if (c.kind === 'need') needs += spent[c.id]; else wants += spent[c.id];
  }
  const saved = income - needs - wants;
  const pct = (v) => (income ? (v / income) * 100 : 0);
  return {
    income,
    needs: { value: needs, pct: pct(needs), ideal: 50 },
    wants: { value: wants, pct: pct(wants), ideal: 30 },
    saved: { value: saved, pct: pct(saved), ideal: 20 },
  };
}

// Money that can still be spent this month without touching bills or savings.
export function safeToSpend(transactions, unpaidBills, daysLeft) {
  const free = balance(transactions) - unpaidBills;
  return { total: free, perDay: daysLeft > 0 ? Math.floor(free / daysLeft) : free };
}

export function goalProjection(goal, monthlyOverride) {
  const monthly = monthlyOverride ?? goal.monthly;
  const remaining = Math.max(0, goal.target - goal.saved);
  const months = monthly > 0 ? Math.ceil(remaining / monthly) : Infinity;
  const when = new Date(2026, 10 + months, 1); // Nov 2026 + months
  const whenLabel = months === Infinity ? '—'
    : when.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  return { remaining, months, whenLabel, pct: goal.saved / goal.target };
}

export function topCategory(transactions) {
  const spent = spentByCategory(transactions);
  let best = null;
  for (const c of CATEGORIES) {
    if (!best || spent[c.id] > spent[best.id]) best = c;
  }
  return { ...best, used: spent[best.id] };
}
