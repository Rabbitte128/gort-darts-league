document.addEventListener("DOMContentLoaded", () => {
  const TAB_KEY = "gdl-cup-league";
  const tabs = document.querySelectorAll(".league-tab");
  const bracketEl = document.querySelector("#cup-bracket");
  const noteEl = document.querySelector("#cup-note");

  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));

  const hasScore = m => m.hs !== null && m.hs !== undefined && m.as !== null && m.as !== undefined;

  function render(key) {
    const cup = CUP_DATA[key];
    const byId = {};
    cup.rounds.forEach(r => r.matches.forEach(m => { byId[m.id] = m; }));

    // Resolve a slot to a team name (or null if not known yet)
    function team(slot) {
      if (slot && typeof slot === "object" && slot.winner) return winnerOf(byId[slot.winner]);
      if (!slot || String(slot).trim().toUpperCase() === "TBC") return null;
      return slot;
    }

    function winnerOf(m) {
      if (!m) return null;
      const home = team(m.home);
      const away = team(m.away);
      if (away === "BYE" && home) return home;
      if (home === "BYE" && away) return away;
      if (!hasScore(m) || m.hs === m.as) return null;
      return m.hs > m.as ? home : away;
    }

    function placeholder(slot) {
      if (slot && typeof slot === "object" && slot.winner) return `Winner ${slot.winner}`;
      return "To be drawn";
    }

    function slotHtml(m, side) {
      const slot = m[side];
      const name = team(slot);
      const score = hasScore(m) ? m[side === "home" ? "hs" : "as"] : "";
      const winner = winnerOf(m);
      const classes = ["cup-slot"];
      if (!name) classes.push("is-tbd");
      if (name === "BYE") classes.push("is-bye");
      if (winner && name === winner) classes.push("is-winner");
      if (winner && name && name !== winner) classes.push("is-loser");

      return `<div class="${classes.join(" ")}">
        <span class="cup-team">${escapeHtml(name || placeholder(slot))}</span>
        <span class="cup-score">${score}</span>
      </div>`;
    }

    const champion = winnerOf(byId.F);

    bracketEl.innerHTML = cup.rounds.map(round => `
      <div class="cup-round">
        <div class="cup-round-head">
          <strong>${escapeHtml(round.name)}</strong>
          <span>${escapeHtml(round.date)}</span>
        </div>
        <div class="cup-round-matches">
          ${round.matches.map(m => `
            <article class="cup-match">
              <span class="cup-match-id">${escapeHtml(m.id === "F" ? "Final" : m.id)}</span>
              ${slotHtml(m, "home")}
              ${slotHtml(m, "away")}
            </article>`).join("")}
        </div>
      </div>`).join("") + `
      <div class="cup-round cup-round-champion">
        <div class="cup-round-head"><strong>Champion</strong><span>🏆</span></div>
        <div class="cup-round-matches">
          <div class="cup-champion ${champion ? "" : "is-tbd"}">${escapeHtml(champion || "To be decided")}</div>
        </div>
      </div>`;

    noteEl.textContent = cup.note;

    // Key dates for the selected cup only
    document.querySelector("#cup-dates-list").innerHTML = cup.rounds.map(round => {
      const d = new Date(round.date);
      const nice = isNaN(d) ? round.date
        : d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
      return `<li>${escapeHtml(round.name)} <span>${escapeHtml(nice)}</span></li>`;
    }).join("");

    tabs.forEach(tab => {
      const active = tab.dataset.league === key;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    try { localStorage.setItem(TAB_KEY, key); } catch (e) { /* ignore */ }
  }

  tabs.forEach(tab => tab.addEventListener("click", () => render(tab.dataset.league)));

  let saved = "a";
  try { saved = localStorage.getItem(TAB_KEY) === "b" ? "b" : "a"; } catch (e) { /* ignore */ }
  render(saved);
});
