// Loads confirmed/approved results from Firestore (public read via REST, no SDK needed)
// and merges them into LEAGUE_DATA before pages render.
// Pages wait on window.RESULTS_READY.
window.RESULTS_READY = (async function () {
  if (typeof FIREBASE_CONFIG === "undefined" || !FIREBASE_CONFIG.projectId) return;

  function parseValue(v) {
    if ("integerValue" in v) return Number(v.integerValue);
    if ("doubleValue" in v) return Number(v.doubleValue);
    if ("stringValue" in v) return v.stringValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("arrayValue" in v) return (v.arrayValue.values || []).map(parseValue);
    if ("mapValue" in v) {
      const o = {};
      Object.entries(v.mapValue.fields || {}).forEach(([k, x]) => { o[k] = parseValue(x); });
      return o;
    }
    if ("nullValue" in v) return null;
    return null;
  }

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}` +
      `/databases/(default)/documents/results?pageSize=500&key=${FIREBASE_CONFIG.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();

    (json.documents || []).forEach(doc => {
      const r = {};
      Object.entries(doc.fields || {}).forEach(([k, v]) => { r[k] = parseValue(v); });

      const league = LEAGUE_DATA[r.league];
      const fixture = league && league.fixtures.find(m =>
        m.id === r.fixtureId && m.home !== "BYE" && m.away !== "BYE");
      if (!fixture || typeof r.hs !== "number" || typeof r.as !== "number") return;

      fixture.hs = r.hs;
      fixture.as = r.as;
      fixture.homePlayers = r.homePlayers || [];
      fixture.awayPlayers = r.awayPlayers || [];

      // Add 180s and checkouts from this match to the league stats.
      const stats = LEAGUE_DATA.stats && LEAGUE_DATA.stats[r.league];
      if (!stats) return;
      (r.oneEighties || []).forEach(t => {
        if (!t || !t.player || typeof t.total !== "number") return;
        const row = stats.oneEighties.find(s => s.player === t.player && s.team === t.team);
        if (row) row.total += t.total;
        else stats.oneEighties.push({ player: t.player, team: t.team, total: t.total });
      });
      (r.checkouts || []).forEach(c => {
        if (!c || !c.player || typeof c.score !== "number") return;
        stats.checkouts.push({ player: c.player, team: c.team, score: c.score });
      });
    });
  } catch (error) {
    console.warn("Could not load online results, using local data.", error);
  }
})();
