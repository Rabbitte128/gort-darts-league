// =====================================================================
// CUP DATA - 2026/27
// ---------------------------------------------------------------------
// HOW TO UPDATE AFTER THE DRAW
//   * Replace a null team with the team name, e.g.  home: "Hennelly's A"
//   * Leave a slot as null (or "TBC") to show "To be drawn". Until the draw,
//     every team in that league sees the cup dates as "v TBC" fixtures.
//   * A slot written as { winner: "QF1" } fills itself in automatically
//     once that match has a score.
//   * Enter scores in hs (home score) and as (away score).
//   * A team drawn against "BYE" goes through automatically.
// =====================================================================

const CUP_DATA = {
  a: {
    label: "A League Cup",
    note: "7 teams - one team receives a bye into the semi-finals.",
    rounds: [
      {
        name: "Quarter-Finals",
        date: "29 Jan 2027",
        matches: [
          { id: "QF1", home: null, away: null, hs: null, as: null },
          { id: "QF2", home: null, away: null, hs: null, as: null },
          { id: "QF3", home: null, away: null, hs: null, as: null },
          { id: "QF4", home: null, away: "BYE", hs: null, as: null }
        ]
      },
      {
        name: "Semi-Finals",
        date: "26 Feb 2027",
        matches: [
          { id: "SF1", home: { winner: "QF1" }, away: { winner: "QF2" }, hs: null, as: null },
          { id: "SF2", home: { winner: "QF3" }, away: { winner: "QF4" }, hs: null, as: null }
        ]
      },
      {
        name: "Final",
        date: "09 Apr 2027",
        matches: [
          { id: "F", home: { winner: "SF1" }, away: { winner: "SF2" }, hs: null, as: null }
        ]
      }
    ]
  },

  b: {
    label: "B League Cup",
    note: "10 teams - 4 teams play preliminary quarter-finals for the last 2 quarter-final places.",
    rounds: [
      {
        name: "Preliminary QF",
        date: "11 Dec 2026",
        matches: [
          { id: "P1", home: null, away: null, hs: null, as: null },
          { id: "P2", home: null, away: null, hs: null, as: null }
        ]
      },
      {
        name: "Quarter-Finals",
        date: "29 Jan 2027",
        matches: [
          { id: "QF1", home: null, away: null, hs: null, as: null },
          { id: "QF2", home: null, away: null, hs: null, as: null },
          { id: "QF3", home: null, away: { winner: "P1" }, hs: null, as: null },
          { id: "QF4", home: null, away: { winner: "P2" }, hs: null, as: null }
        ]
      },
      {
        name: "Semi-Finals",
        date: "26 Feb 2027",
        matches: [
          { id: "SF1", home: { winner: "QF1" }, away: { winner: "QF2" }, hs: null, as: null },
          { id: "SF2", home: { winner: "QF3" }, away: { winner: "QF4" }, hs: null, as: null }
        ]
      },
      {
        name: "Final",
        date: "09 Apr 2027",
        matches: [
          { id: "F", home: { winner: "SF1" }, away: { winner: "SF2" }, hs: null, as: null }
        ]
      }
    ]
  }
};

// ---------------------------------------------------------------------
// Helpers (used by the team page). No need to edit below this line.
// ---------------------------------------------------------------------

// Resolve a slot ("Team name", null/"TBC", or { winner: "QF1" }) to a team name.
function cupResolveTeam(cup, slot) {
  if (slot && typeof slot === "object" && slot.winner) {
    const match = cup.rounds.flatMap(r => r.matches).find(m => m.id === slot.winner);
    return cupWinnerOf(cup, match);
  }
  if (!slot || String(slot).trim().toUpperCase() === "TBC") return null;
  return slot;
}

function cupWinnerOf(cup, match) {
  if (!match) return null;
  const home = cupResolveTeam(cup, match.home);
  const away = cupResolveTeam(cup, match.away);
  if (away === "BYE" && home) return home;
  if (home === "BYE" && away) return away;
  if (match.hs === null || match.as === null || match.hs === match.as) return null;
  return match.hs > match.as ? home : away;
}

// Cup matches for a team, with resolved team names.
// While a round still has open (TBC) places and the team is not yet placed
// in it or knocked out, a "TBC" fixture is shown so every team sees the date.
function getCupMatchesForTeam(leagueKey, teamName) {
  const cup = CUP_DATA[leagueKey];
  if (!cup) return [];
  const allMatches = cup.rounds.flatMap(r => r.matches);

  // Knocked out = in a decided match they did not win (BYE wins count as decided)
  const knockedOut = allMatches.some(m => {
    const home = cupResolveTeam(cup, m.home);
    const away = cupResolveTeam(cup, m.away);
    const winner = cupWinnerOf(cup, m);
    return winner && (home === teamName || away === teamName) && winner !== teamName;
  });

  const list = [];
  cup.rounds.forEach(round => {
    let placed = false;
    let hasOpenPlace = false;

    round.matches.forEach(match => {
      const home = cupResolveTeam(cup, match.home);
      const away = cupResolveTeam(cup, match.away);
      if (!home || !away) hasOpenPlace = true;
      if (home === teamName || away === teamName) {
        placed = true;
        list.push({ ...match, home, away: away || "TBC", round: round.name, date: round.date, cup: cup.label });
      }
    });

    if (!placed && hasOpenPlace && !knockedOut && !cupTeamPlacedElsewhere(cup, round, teamName)) {
      list.push({
        id: `${round.name}-TBC`, home: teamName, away: "TBC", hs: null, as: null,
        round: round.name, date: round.date, cup: cup.label, tbc: true
      });
    }
  });
  return list;
}

// Once the draw for an early round is complete, teams placed directly into
// a later round should not see a TBC fixture for the earlier round.
function cupTeamPlacedElsewhere(cup, round, teamName) {
  const index = cup.rounds.indexOf(round);
  const roundIsDrawn = round.matches.every(m => {
    const fixed = s => (s && typeof s === "object") || (s && String(s).trim().toUpperCase() !== "TBC");
    return fixed(m.home) && fixed(m.away);
  });
  if (!roundIsDrawn) return false;
  return cup.rounds.slice(index + 1).some(r => r.matches.some(m =>
    cupResolveTeam(cup, m.home) === teamName || cupResolveTeam(cup, m.away) === teamName));
}
