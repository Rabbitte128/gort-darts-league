(function () {
  const root = document.getElementById("honour-page");
  if (!root || typeof HISTORY_DATA === "undefined") return;

  const id = new URLSearchParams(window.location.search).get("id");
  let selected = null;

  HISTORY_DATA.some(season => {
    const honour = season.competitions.find(item => item.id === id);
    if (!honour) return false;
    selected = { ...honour, season: season.season };
    return true;
  });

  if (!selected) {
    root.innerHTML = `
      <section class="page-title">
        <span class="eyebrow">HALL OF FAME</span>
        <h1>Honour not found</h1>
        <p>This Hall of Fame entry has not been added yet.</p>
      </section>
      <a class="team-back-link" href="history.html">← Back to Hall of Fame</a>
    `;
    return;
  }

  document.title = `${selected.winner} • ${selected.season} | Gort Darts League`;

  const matchDetails = [selected.date, selected.venue].filter(Boolean).join(" • ");
  const hasPlayers = selected.players && selected.players.length;
  const teamPhoto = selected.teamPhoto || null;
  const presentationPhotos = selected.presentationPhotos || [];

  root.innerHTML = `
    <section class="hof-hero">
      <a class="team-back-link" href="history.html">← Back to Hall of Fame</a>
      <span class="eyebrow">${selected.season} • ${selected.competition}</span>
      <div class="hof-title-row">
        <div>
          <h1>${selected.winner}</h1>
          <p>${selected.competition} Champions.</p>
        </div>
        <div class="hof-trophy-mark" aria-hidden="true">🏆</div>
      </div>
    </section>

    ${selected.runnerUp || selected.score || matchDetails ? `
      <section class="panel hof-final-card">
        <span class="eyebrow">FINAL</span>
        <div class="hof-scoreline">
          <strong>${selected.winner}</strong>
          <span>${selected.score || "v"}</span>
          <strong>${selected.runnerUp || "Opponent to be added"}</strong>
        </div>
        ${matchDetails ? `<p>${matchDetails}</p>` : ""}
      </section>
    ` : ""}

    ${hasPlayers ? `
      <section class="panel hof-team-list hof-team-list-full">
        <span class="eyebrow">WINNING TEAM</span>
        <h2>Champions</h2>
        <ol>${selected.players.map(player => `<li>${player}</li>`).join("")}</ol>
      </section>
    ` : ""}

    <section class="hof-gallery-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">MEMORIES</span>
          <h2>Champions Gallery</h2>
        </div>
      </div>

      ${teamPhoto ? `
        <article class="hof-team-photo-card">
          <a href="${teamPhoto.src}" target="_blank" rel="noopener">
            <img src="${teamPhoto.src}" alt="${teamPhoto.alt || `${selected.winner} team photo ${selected.season}`}">
          </a>
          <div>
            <span class="eyebrow">TEAM PHOTO</span>
            <strong>${teamPhoto.caption || `${selected.winner} • ${selected.season}`}</strong>
          </div>
        </article>
      ` : `
        <div class="hof-team-photo-placeholder">
          <span>📸</span>
          <strong>Champions Team Photo</strong>
          <small>Add the winning team photo in <code>history-data.js</code></small>
        </div>
      `}
  `;
})();
