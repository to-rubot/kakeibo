# kakeibo

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/to-rubot/kakeibo/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/to-rubot/kakeibo/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**Kakeibo — a household budget site in yen, for a Japanese home.** One household's November 2026, kept properly: a live dashboard (income, spending, savings rate, safe-to-spend after unpaid bills), a transactions page where adding, searching, filtering and deleting really recalculates everything, category envelope budgets with adjustable limits and a 50/30/20 check, savings goals with a monthly-amount slider that re-dates each goal, a bills calendar with paid tick-boxes, and a month-vs-month insights page. Fully offline static files — no build step, no network requests — on desktop and phone.

All figures are the site's own sample household (two adults, one child, renting in a regional city), written for this site.

## Run it

```sh
node serve.ts            # http://localhost:8080 — serves app/
# or open app/index.html in a browser
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # hand-in build: writes out/dossier.json
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=brisk-fox-91&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
