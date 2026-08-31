function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPlayerStats(player, team) {
  const oneEighties = LEAGUE_DATA.stats.oneEighties
    .filter(row => row.team === team && row.player === player)
    .reduce((total, row) => total + row.total, 0);

  const checkoutRows = LEAGUE_DATA.stats.checkouts
    .filter(row => row.team === team && row.player === player);
  const bestCheckout = checkoutRows.length
    ? Math.max(...checkoutRows.map(row => row.score))
    : null;

  return { oneEighties, bestCheckout };
}

function renderPlayer(player, team, index) {
  const name = typeof player === "string" ? player : player.name;
  const role = typeof player === "object" ? player.role : "";
  const stats = getPlayerStats(name, team);

  return `
    <li class="team-player-card">
      <span class="player-number">${index + 1}</span>
      <span class="player-details">
        <strong>${escapeHtml(name)}</strong>
        ${role ? `<small>${escapeHtml(role)}</small>` : ""}
      </span>
      <span class="player-stat-badges">
        ${stats.oneEighties ? `<span class="stat-badge">🎯 ${stats.oneEighties} × 180</span>` : ""}
        ${stats.bestCheckout ? `<span class="stat-badge">🔥 ${stats.bestCheckout} checkout</span>` : ""}
      </span>
    </li>`;
}

function renderHonours(honours) {
  if (!honours.length) {
    return `<p class="team-empty">Roll of honour to be added.</p>`;
  }

  return `<ul class="honours-list">${honours.map(honour => {
    if (typeof honour === "string") return `<li>${escapeHtml(honour)}</li>`;
    const years = honour.years ? ` <span>${escapeHtml(honour.years)}</span>` : "";
    return `<li><strong>${escapeHtml(honour.title)}</strong>${years}</li>`;
  }).join("")}</ul>`;
}

function renderTeamStats(team) {
  const oneEighties = LEAGUE_DATA.stats.oneEighties.filter(row => row.team === team);
  const checkouts = LEAGUE_DATA.stats.checkouts.filter(row => row.team === team);

  if (!oneEighties.length && !checkouts.length) {
    return `<p class="team-empty">No individual 180 or high-checkout entries recorded for this team yet.</p>`;
  }

  return `<div class="team-stat-summary">
    ${oneEighties.map(row => `<div><strong>${escapeHtml(row.player)}</strong><span>🎯 ${row.total} × 180</span></div>`).join("")}
    ${checkouts.map(row => `<div><strong>${escapeHtml(row.player)}</strong><span>🔥 ${row.score} checkout</span></div>`).join("")}
  </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const teamName = params.get("team");
  const team = teamName ? TEAM_DATA[teamName] : null;
  const page = document.querySelector("#team-page");

  if (!team) {
    document.title = "Team not found | Gort Darts League";
    page.innerHTML = `
      <section class="page-title">
        <span class="eyebrow">2026-2027</span>
        <h1>Team not found</h1>
        <p>This team profile has not been set up yet.</p>
      </section>
      <a class="button primary" href="../a-league/standings.html">Back to standings</a>`;
    return;
  }

  document.title = `${teamName} | Gort Darts League`;
  const standingsHref = team.league === "A League"
    ? "../a-league/standings.html"
    : "../b-league/standings.html";

  page.innerHTML = `
    <section class="page-title team-title">
      <span class="eyebrow">${escapeHtml(team.league)} · 2026-2027</span>
      <h1>${escapeHtml(teamName)}</h1>
      ${team.established ? `<p class="team-established">Established ${escapeHtml(team.established)}</p>` : ""}
    </section>

    <a class="team-back-link" href="${standingsHref}">← Back to ${escapeHtml(team.league)} standings</a>

    <section class="team-profile-grid">
      <article class="panel team-about">
        <h2>About the team</h2>
        <p>${team.about ? escapeHtml(team.about) : "Team history and information to be added."}</p>
      </article>

      <article class="panel team-honours">
        <h2>🏆 Roll of Honour</h2>
        ${renderHonours(team.honours)}
      </article>
    </section>

    <section class="panel team-squad">
      <div class="team-section-heading">
        <h2>Current Squad</h2>
        <span>${team.players.length ? `${team.players.length} players` : "2026-2027"}</span>
      </div>
      ${team.players.length
        ? `<ol class="team-player-list">${team.players.map((player, i) => renderPlayer(player, teamName, i)).join("")}</ol>`
        : `<p class="team-empty">Current player list to be added.</p>`}
    </section>

    <section class="panel team-individual-stats">
      <h2>Individual Stats</h2>
      <p class="section-intro">180s and highest checkouts recorded for ${escapeHtml(teamName)}.</p>
      ${renderTeamStats(teamName)}
    </section>`;
});
