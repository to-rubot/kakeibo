// Kakeibo charts — small hand-drawn SVG helpers, no library.

// Donut of category shares. entries: [{label, color, value}]
export function donutChart(entries, size = 190) {
  const total = entries.reduce((s, e) => s + e.value, 0) || 1;
  const r = size / 2 - 6, cx = size / 2, cy = size / 2, inner = r * 0.62;
  let angle = -Math.PI / 2;
  const arcs = [];
  for (const e of entries) {
    if (!e.value) continue;
    const sweep = (e.value / total) * Math.PI * 2;
    const a0 = angle, a1 = angle + sweep;
    angle = a1;
    const large = sweep > Math.PI ? 1 : 0;
    const p = (rad, a) => `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
    arcs.push(`<path d="M ${p(r, a0)} A ${r} ${r} 0 ${large} 1 ${p(r, a1)} L ${p(inner, a1)} A ${inner} ${inner} 0 ${large} 0 ${p(inner, a0)} Z" fill="${e.color}"><title>${e.label}</title></path>`);
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category">${arcs.join('')}</svg>`;
}

// Grouped bars: income vs expense per month.
export function trendChart(history, width = 560, height = 210) {
  const max = Math.max(...history.map((h) => Math.max(h.income, h.expense))) * 1.1;
  const step = width / history.length, bw = step * 0.28, base = height - 24;
  const parts = [`<line x1="0" y1="${base}" x2="${width}" y2="${base}" stroke="#cbd5e1"/>`];
  history.forEach((h, i) => {
    const x = i * step + step * 0.14;
    const ih = (h.income / max) * (base - 12), eh = (h.expense / max) * (base - 12);
    parts.push(`<rect x="${x.toFixed(1)}" y="${(base - ih).toFixed(1)}" width="${bw}" height="${ih.toFixed(1)}" rx="3" fill="#16a34a"><title>${h.month} income</title></rect>`);
    parts.push(`<rect x="${(x + bw + 4).toFixed(1)}" y="${(base - eh).toFixed(1)}" width="${bw}" height="${eh.toFixed(1)}" rx="3" fill="#f59e0b"><title>${h.month} spending</title></rect>`);
    parts.push(`<text x="${(x + bw).toFixed(1)}" y="${height - 6}" text-anchor="middle" font-size="12" fill="#64748b">${h.month}</text>`);
  });
  return `<svg viewBox="0 0 ${width} ${height}" class="trend" role="img" aria-label="Income and spending by month">${parts.join('')}</svg>`;
}

export function progressBar(pct, color) {
  const clamped = Math.min(100, Math.max(0, pct * 100));
  const barColor = pct > 1 ? '#dc2626' : color;
  return `<div class="bar"><div class="bar-fill" style="width:${clamped.toFixed(1)}%;background:${barColor}"></div></div>`;
}
