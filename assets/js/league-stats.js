// Renders the 180 and highest-checkout leaderboards for one league.
// The league comes from data-league="a" / "b" on #page-content.
document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector("#page-content");
  const stats = LEAGUE_DATA.stats[content.dataset.league] || { oneEighties: [], checkouts: [] };

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const leaderboard = (rows, key, emptyText) => {
    if (!rows.length) return `<p class="empty-state">${emptyText}</p>`;

    const sorted = [...rows].sort((x, y) => y[key] - x[key]);
    let previousValue = null;
    let previousRank = 0;

    return `<ol class="leaderboard">${sorted.map((r, i) => {
      const value = r[key];
      const rank = value === previousValue ? previousRank : i + 1; // same value = same rank
      previousValue = value;
      previousRank = rank;

      return `<li>
        <span class="rank">${rank}</span>
        <span>
          <strong>${escapeHtml(r.player)}</strong>
          <small>${escapeHtml(r.team)}</small>
        </span>
        <strong class="stat-value">${value}</strong>
      </li>`;
    }).join("")}</ol>`;
  };

  content.innerHTML = `
    <div class="stats-grid">
      <article class="panel">
        <h2>🎯 180 Leaderboard</h2>
        ${leaderboard(stats.oneEighties, "total", "No 180s recorded yet.")}
      </article>
      <article class="panel">
        <h2>🔥 Highest Checkouts</h2>
        ${leaderboard(stats.checkouts, "score", "No checkouts recorded yet.")}
      </article>
    </div>`;
});
