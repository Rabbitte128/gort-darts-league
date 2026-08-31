function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function getLeagueForTeam(team) {
  return team.league === "A League" ? LEAGUE_DATA.a : LEAGUE_DATA.b;
}

function getCurrentSeason(teamName, team) {
  const league = getLeagueForTeam(team);
  const standings = calculateStandings(league);
  const rowIndex = standings.findIndex(row => row.team === teamName);
  const row = rowIndex >= 0 ? standings[rowIndex] : null;

  const completedMatches = getResults(league)
    .filter(match => match.home === teamName || match.away === teamName)
    .sort((a, b) => a.week - b.week || a.id - b.id);

  const form = completedMatches.slice(-5).map(match => {
    const isHome = match.home === teamName;
    const teamScore = isHome ? match.hs : match.as;
    const opponentScore = isHome ? match.as : match.hs;

    if (teamScore > opponentScore) return "W";
    if (teamScore < opponentScore) return "L";
    return "D";
  });

  return {
    position: row && row.p > 0 ? rowIndex + 1 : null,
    played: row ? row.p : 0,
    points: row ? row.pts : 0,
    form
  };
}

function ordinal(number) {
  const mod100 = number % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${number}th`;

  switch (number % 10) {
    case 1: return `${number}st`;
    case 2: return `${number}nd`;
    case 3: return `${number}rd`;
    default: return `${number}th`;
  }
}

function renderCurrentSeason(teamName, team) {
  const season = getCurrentSeason(teamName, team);
  const position = season.position ? ordinal(season.position) : "—";

  const formHtml = season.played >= 5
    ? `<div class="team-form">
        ${season.form.map(result => `<span class="form-result form-${result.toLowerCase()}">${result}</span>`).join("")}
      </div>`
    : `<p class="team-form-pending">Form will appear after 5 matches have been played.</p>`;

  return `
    <div class="season-summary">
      <div class="season-stat season-position">
        <strong>${position}</strong>
        <span>League Position</span>
      </div>
      <div class="season-stat">
        <strong>${season.points}</strong>
        <span>Points</span>
      </div>
      <div class="season-stat">
        <strong>${season.played}</strong>
        <span>Played</span>
      </div>
    </div>
    <div class="season-form-row">
      <strong>Last 5</strong>
      ${formHtml}
    </div>`;
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
  return `<ul class="honours-list">${honours.map(honour => {
    if (typeof honour === "string") return `<li>${escapeHtml(honour)}</li>`;
    const years = honour.years ? ` <span>${escapeHtml(honour.years)}</span>` : "";
    return `<li><strong>${escapeHtml(honour.title)}</strong>${years}</li>`;
  }).join("")}</ul>`;
}

function getTeamStats(team) {
  const oneEighties = LEAGUE_DATA.stats.oneEighties.filter(row => row.team === team);
  const checkouts = LEAGUE_DATA.stats.checkouts.filter(row => row.team === team);
  return { oneEighties, checkouts };
}

function renderTeamStats(team) {
  const { oneEighties, checkouts } = getTeamStats(team);

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

  const honours = Array.isArray(team.honours) ? team.honours : [];
  const players = Array.isArray(team.players) ? team.players : [];
  const teamStats = getTeamStats(teamName);
  const hasIndividualStats = teamStats.oneEighties.length || teamStats.checkouts.length;

  page.innerHTML = `
    <section class="page-title team-title">
      <span class="eyebrow">${escapeHtml(team.league)} · 2026-2027</span>
      <h1>${escapeHtml(teamName)}</h1>
      ${team.established ? `<p class="team-established">Established ${escapeHtml(team.established)}</p>` : ""}
    </section>

    <a class="team-back-link" href="${standingsHref}">← Back to ${escapeHtml(team.league)} standings</a>

    <section class="team-profile-grid">
      <article class="panel team-current-season">
        <h2>Current Season</h2>
        ${renderCurrentSeason(teamName, team)}
      </article>

      ${honours.length ? `
        <article class="panel team-honours">
          <h2>🏆 Roll of Honour</h2>
          ${renderHonours(honours)}
        </article>
      ` : ""}
    </section>

    <section class="panel team-squad">
      <div class="team-section-heading">
        <h2>Current Squad</h2>
        <span>${players.length ? `${players.length} players` : "2026-2027"}</span>
      </div>
      ${players.length
        ? `<ol class="team-player-list">${players.map((player, i) => renderPlayer(player, teamName, i)).join("")}</ol>`
        : `<p class="team-empty">Current player list to be added.</p>`}
    </section>

    ${hasIndividualStats ? `
      <section class="panel team-individual-stats">
        <h2>Individual Stats</h2>
        <p class="section-intro">180s and highest checkouts recorded for ${escapeHtml(teamName)}.</p>
        ${renderTeamStats(teamName)}
      </section>
    ` : ""}`;
});
