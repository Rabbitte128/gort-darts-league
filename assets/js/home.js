document.addEventListener("DOMContentLoaded", async () => {
  await window.RESULTS_READY;

  // One A / B League switch at the top of the page controls the hero,
  // the latest results and the next fixtures.
  const RESULTS_PER_TAB = 4;
  const FIXTURES_PER_TAB = 4;
  const TAB_KEY = "gdl-home-league";

  const LEAGUES = {
    a: { label: "A League", photoClass: "hero--a-league" },
    b: { label: "B League", photoClass: "hero--b-league" }
  };

  const $ = selector => document.querySelector(selector);
  const tabs = document.querySelectorAll(".league-tab");
  const hero = $("#home-hero");

  function showLeague(key) {
    const { label, photoClass } = LEAGUES[key];
    const league = LEAGUE_DATA[key];
    const folder = `${key}-league`;

    // Tabs
    tabs.forEach(tab => {
      const active = tab.dataset.league === key;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    // Hero: photo, label and button links
    Object.values(LEAGUES).forEach(l => hero.classList.remove(l.photoClass));
    hero.classList.add(photoClass);
    $("#hero-eyebrow").textContent = `2026/27 Season · ${label}`;
    $("#hero-standings").href = `${folder}/standings.html`;
    $("#hero-fixtures").href = `${folder}/fixtures.html`;
    $("#hero-results").href = `${folder}/results.html`;

    // Latest results
    const results = getResults(league).slice(-RESULTS_PER_TAB).reverse();
    $("#results-title").textContent = `Latest ${label} Results`;
    $("#home-results").innerHTML = results.length
      ? resultCards(results, label)
      : `<p class="empty-state">No ${label} results yet. Check back after the first match night.</p>`;
    $("#results-view-all").href = `${folder}/results.html`;
    $("#results-view-all").textContent = `View all ${label} results →`;

    // Next fixtures
    const fixtures = getUpcomingFixtures(league).slice(0, FIXTURES_PER_TAB);
    $("#fixtures-title").textContent = `Next ${label} Fixtures`;
    $("#home-fixtures").innerHTML = fixtures.length
      ? fixtureCards(fixtures, label)
      : `<p class="empty-state">No upcoming ${label} fixtures.</p>`;
    $("#fixtures-view-all").href = `${folder}/fixtures.html`;

    try { localStorage.setItem(TAB_KEY, key); } catch (e) { /* ignore */ }
  }

  tabs.forEach(tab => tab.addEventListener("click", () => showLeague(tab.dataset.league)));

  let saved = "a";
  try { saved = localStorage.getItem(TAB_KEY) === "b" ? "b" : "a"; } catch (e) { /* ignore */ }
  showLeague(saved);
});
