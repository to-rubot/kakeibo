// Kakeibo data — one Japanese household's November 2026, in yen.
// All figures are the site's own sample household (two adults, one child,
// renting in a regional city), written for this site. Amounts are yen.

export const HOUSEHOLD = {
  name: 'The Yamada household',
  monthLabel: 'November 2026',
  members: '2 adults · 1 child · renting',
  payday: 25,
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2563eb', kind: 'need' },
  { id: 'utilities', label: 'Utilities', color: '#0891b2', kind: 'need' },
  { id: 'groceries', label: 'Groceries', color: '#16a34a', kind: 'need' },
  { id: 'dining', label: 'Dining out', color: '#f59e0b', kind: 'want' },
  { id: 'transport', label: 'Transport', color: '#7c3aed', kind: 'need' },
  { id: 'health', label: 'Health', color: '#db2777', kind: 'need' },
  { id: 'education', label: 'Education & kids', color: '#ea580c', kind: 'need' },
  { id: 'leisure', label: 'Leisure', color: '#9333ea', kind: 'want' },
  { id: 'shopping', label: 'Shopping', color: '#475569', kind: 'want' },
  { id: 'subscriptions', label: 'Subscriptions', color: '#0d9488', kind: 'want' },
];

export const BUDGET_LIMITS = {
  housing: 85000, utilities: 18000, groceries: 55000, dining: 18000,
  transport: 12000, health: 10000, education: 25000, leisure: 15000,
  shopping: 20000, subscriptions: 6000,
};

// type: 'income' | 'expense'; amount in yen, always positive.
export const SEED_TRANSACTIONS = [
  { id: 1, date: '2026-11-25', type: 'income', category: 'salary', note: 'Salary — main job', amount: 342000 },
  { id: 2, date: '2026-11-10', type: 'income', category: 'salary', note: 'Side work — website help', amount: 28000 },
  { id: 3, date: '2026-11-01', type: 'expense', category: 'housing', note: 'Rent', amount: 82000 },
  { id: 4, date: '2026-11-01', type: 'expense', category: 'housing', note: 'Management fee', amount: 3000 },
  { id: 5, date: '2026-11-15', type: 'expense', category: 'utilities', note: 'Electricity', amount: 6840 },
  { id: 6, date: '2026-11-15', type: 'expense', category: 'utilities', note: 'Gas', amount: 4120 },
  { id: 7, date: '2026-11-18', type: 'expense', category: 'utilities', note: 'Water (2 months)', amount: 3860 },
  { id: 8, date: '2026-11-03', type: 'expense', category: 'groceries', note: 'Supermarket — weekly shop', amount: 9230 },
  { id: 9, date: '2026-11-07', type: 'expense', category: 'groceries', note: 'Supermarket — fresh food', amount: 7840 },
  { id: 10, date: '2026-11-12', type: 'expense', category: 'groceries', note: 'Supermarket — weekly shop', amount: 8610 },
  { id: 11, date: '2026-11-19', type: 'expense', category: 'groceries', note: 'Market — vegetables & fish', amount: 6980 },
  { id: 12, date: '2026-11-23', type: 'expense', category: 'groceries', note: 'Supermarket — weekly shop', amount: 8120 },
  { id: 13, date: '2026-11-05', type: 'expense', category: 'dining', note: 'Ramen with family', amount: 3240 },
  { id: 14, date: '2026-11-14', type: 'expense', category: 'dining', note: 'Cafe — coffee & cake', amount: 1860 },
  { id: 15, date: '2026-11-21', type: 'expense', category: 'dining', note: 'Sushi — weekend treat', amount: 5480 },
  { id: 16, date: '2026-11-02', type: 'expense', category: 'transport', note: 'Train pass top-up', amount: 5980 },
  { id: 17, date: '2026-11-16', type: 'expense', category: 'transport', note: 'Petrol', amount: 4200 },
  { id: 18, date: '2026-11-08', type: 'expense', category: 'health', note: 'Pharmacy', amount: 2340 },
  { id: 19, date: '2026-11-20', type: 'expense', category: 'health', note: 'Dentist — child', amount: 3120 },
  { id: 20, date: '2026-11-06', type: 'expense', category: 'education', note: 'Picture books', amount: 2860 },
  { id: 21, date: '2026-11-17', type: 'expense', category: 'education', note: 'Swimming school', amount: 8800 },
  { id: 22, date: '2026-11-09', type: 'expense', category: 'education', note: 'School lunch fee', amount: 4600 },
  { id: 23, date: '2026-11-11', type: 'expense', category: 'leisure', note: 'Cinema — family', amount: 4200 },
  { id: 24, date: '2026-11-22', type: 'expense', category: 'leisure', note: 'Park & museum day', amount: 3600 },
  { id: 25, date: '2026-11-13', type: 'expense', category: 'shopping', note: 'Winter jumper — child', amount: 3980 },
  { id: 26, date: '2026-11-24', type: 'expense', category: 'shopping', note: 'Household goods', amount: 5240 },
  { id: 27, date: '2026-11-04', type: 'expense', category: 'subscriptions', note: 'Music streaming', amount: 1080 },
  { id: 28, date: '2026-11-04', type: 'expense', category: 'subscriptions', note: 'Video streaming', amount: 1490 },
  { id: 29, date: '2026-11-26', type: 'expense', category: 'subscriptions', note: 'Cloud storage', amount: 380 },
  { id: 30, date: '2026-11-25', type: 'expense', category: 'savings', note: 'Transfer to savings', amount: 50000 },
];

// Six finished months, for the trend chart and month-on-month comparisons.
export const MONTH_HISTORY = [
  { month: 'Jun', income: 358000, expense: 271400 },
  { month: 'Jul', income: 362000, expense: 289900 },
  { month: 'Aug', income: 370000, expense: 301200 },
  { month: 'Sep', income: 365000, expense: 264800 },
  { month: 'Oct', income: 368000, expense: 258300 },
  { month: 'Nov', income: 370000, expense: 0 }, // filled live from transactions
];

export const LAST_MONTH_BY_CATEGORY = {
  housing: 85000, utilities: 13920, groceries: 44710, dining: 12400,
  transport: 11480, health: 4980, education: 17160, leisure: 9200,
  shopping: 13460, subscriptions: 2950,
};

export const GOALS = [
  { id: 'emergency', label: 'Emergency fund', target: 1000000, saved: 620000, monthly: 30000, note: 'Six months of essentials, kept separate.' },
  { id: 'trip', label: 'Hokkaido family trip', target: 240000, saved: 96000, monthly: 20000, note: 'Flights, 3 nights, and a seafood budget.' },
  { id: 'laptop', label: 'New laptop', target: 180000, saved: 45000, monthly: 15000, note: 'For side work — replaces a 2019 machine.' },
];

export const BILLS = [
  { id: 1, day: 1, label: 'Rent + management fee', amount: 85000, paid: true },
  { id: 2, day: 4, label: 'Streaming & music', amount: 2570, paid: true },
  { id: 3, day: 15, label: 'Electricity, gas & water', amount: 14820, paid: true },
  { id: 4, day: 17, label: 'Swimming school', amount: 8800, paid: true },
  { id: 5, day: 26, label: 'Cloud storage', amount: 380, paid: true },
  { id: 6, day: 27, label: 'Internet', amount: 5280, paid: false },
  { id: 7, day: 27, label: 'Mobile phones (2 lines)', amount: 6980, paid: false },
  { id: 8, day: 30, label: 'Credit card settlement', amount: 41260, paid: false },
];

export const TIPS = [
  'Cooking at home 4 nights a week instead of 3 saves this household about ¥9,600 a month — ¥115,200 a year.',
  'The 24-hour rule: leave non-essential shopping in the basket a day. About a third is never bought.',
  'Fixed costs first: rent, utilities and subscriptions here are ¥105,850 — every ¥1,000 cut there repeats 12 times a year.',
  'Pay yourself first: the ¥50,000 savings transfer leaves on payday, before spending starts.',
  'A weekly 10-minute money check beats a monthly 2-hour one — small leaks are caught while they are small.',
  'Name every savings goal. “Hokkaido trip” is saved for; “savings” is spent.',
];
