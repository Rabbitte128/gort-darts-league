(function () {
  const seasonsContainer = document.getElementById("history-seasons");
  const recordsContainer = document.getElementById("history-records");
  const filter = document.getElementById("competition-filter");
  if (!seasonsContainer || !recordsContainer || !filter || typeof HISTORY_DATA === "undefined") return;

  const allHonours = HISTORY_DATA.flatMap(season =>
    season.competitions.map(honour => ({ ...honour, season: season.season }))
  );

  const competitions = [...new Set(allHonours.map(item => item.competition))].sort();
  competitions.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    filter.appendChild(option);
  });

  function countTitlesByTeam() {
    const totals = {};
    allHonours.forEach(item => {
      totals[item.winner] = (totals[item.winner] || 0) + 1;
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }

  function renderSeasons(selectedCompetition = "all") {
    const html = HISTORY_DATA.map(season => {
      const competitionsForSeason = season.competitions.filter(item =>
        selectedCompetition === "all" || item.competition === selectedCompetition
      );

      if (!competitionsForSeason.length) return "";

      return `
        <article class="history-season-block">
          <div class="history-season-label">
            <span>SEASON</span>
            <strong>${season.season}</strong>
          </div>
          <div class="history-winner-grid">
            ${competitionsForSeason.map(item => `
              <a class="history-winner-card" href="honour.html?id=${encodeURIComponent(item.id)}">
                <span class="history-competition">${item.competition}</span>
                <span class="history-trophy" aria-hidden="true">🏆</span>
                <strong>${item.winner}</strong>
                <small>${item.runnerUp ? `v ${item.runnerUp}${item.score ? ` • ${item.score}` : ""}` : "View season details"}</small>
                <span class="history-view">View story →</span>
              </a>
            `).join("")}
          </div>
        </article>
      `;
    }).join("");

    seasonsContainer.innerHTML = html || `<div class="panel history-empty">No winners have been added for this competition yet.</div>`;
  }

  filter.addEventListener("change", event => renderSeasons(event.target.value));
  renderSeasons();
})();
