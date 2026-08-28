document.addEventListener("DOMContentLoaded", () => {
  const s = LEAGUE_DATA.stats;

  const leaderboard = (rows, key) => {
    let previousValue = null;
    let previousRank = 0;

    return `<ol class="leaderboard">${
      rows.map((r, i) => {
        const value = r[key];

        // Same value = same rank
        const rank = value === previousValue ? previousRank : i + 1;

        previousValue = value;
        previousRank = rank;

        return `<li>
          <span class="rank">${rank}</span>
          <span>
            <strong>${r.player}</strong>
            <small>${r.team}</small>
          </span>
          <strong class="stat-value">${value}</strong>
        </li>`;
      }).join("")
    }</ol>`;
  };

  document.querySelector("#page-content").innerHTML = `
    <div class="stats-grid">
      <article class="panel">
        <h2>🎯 180 Leaderboard</h2>
        ${leaderboard(s.oneEighties, "total")}
      </article>

      <article class="panel">
        <h2>🔥 Highest Checkouts</h2>
        ${leaderboard(s.checkouts, "score")}
      </article>
    </div>
});
