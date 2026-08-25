const LEAGUE_DATA = {
  a: {
    label: "A League", pointsPerMatch: 9,
    teams: [
      "Bradley's A",
      "Dicey's A",
      "Dicey's B",
      "Hennelly's A",
      "Hennelly's B",
      "Mullins' A",
      "The Auld Triangle",
      "Walsh's A"
    ],
    fixtures: [
      // Week 1
      {
        id: 1, week: 1, date: "9 Oct 2026", time: "9:30 pm", home: "Dicey's A", away: "Dicey's B",
        hs: 9, as: 0
      },
      {
        id: 2, week: 1, date: "9 Oct 2026", time: "9:30 pm", home: "Hennelly's A", away: "Hennelly's B",
        hs: 3, as: 6
      },
      {
        id: 3, week: 1, date: "9 Oct 2026", time: "9:30 pm", home: "Mullins' A", away: "Walsh's A",
        hs: 4, as: 5
      },
      {
        id: 4, week: 1, date: "9 Oct 2026", time: "9:30 pm", home: "The Auld Triangle", away: "Bradley's A",
        hs: 4, as: 5
      },
      // Week 2
      {
        id: 5, week: 2, date: "16 Oct 2026", time: "9:30 pm", home: "Dicey's B", away: "Mullins' A",
        hs: null, as: null
      },
      {
        id: 6, week: 2, date: "16 Oct 2026", time: "9:30 pm", home: "Hennelly's B", away: "The Auld Triangle",
        hs: null, as: null
      },
      {
        id: 7, week: 2, date: "16 Oct 2026", time: "9:30 pm", home: "Bradley's A", away: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 8, week: 2, date: "16 Oct 2026", time: "9:30 pm", home: "Walsh's A", away: "Hennelly's A",
        hs: null, as: null
      },
      // Week 3
      {
        id: 9, week: 3, date: "23 Oct 2026", time: "9:30 pm", home: "Hennelly's A", away: "Mullins' A",
        hs: null, as: null
      },
      {
        id: 10, week: 3, date: "23 Oct 2026", time: "9:30 pm", home: "Bradley's A", away: "Hennelly's A",
        hs: null, as: null
      },
      {
        id: 11, week: 3, date: "23 Oct 2026", time: "9:30 pm", home: "Bradley's A", away: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 12, week: 3, date: "23 Oct 2026", time: "9:30 pm", home: "Walsh's A", away: "The Auld Triangle",
        hs: null, as: null
      }
    ]

  }
  ,
  b: {
    label: "B League", pointsPerMatch: 15,
    teams: [
      "Bradley's B",
      "Harte's",
      "McCarthy's",
      "Mullins B",
      "O'Donnells B",
      "The Lady Gregory",
      "The Ledger Bar",
      "Walsh's B",
      "O'Donnell's C"
    ],
    fixtures: [
      // Week 1
      {
        id: 1, week: 1, date: "2 Oct 2026", time: "9:30 pm", home: "TBC", away: "TBC",
        hs: null, as: null
      },
      {
        id: 2, week: 1, date: "2 Oct 2026", time: "9:30 pm", home: "TBC", away: "TBC",
        hs: null, as: null
      },
      {
        id: 3, week: 1, date: "2 Oct 2026", time: "9:30 pm", home: "TBC", away: "TBC",
        hs: null, as: null
      },
      {
        id: 4, week: 1, date: "2 Oct 2026", time: "9:30 pm", home: "TBC", away: "TBC",
        hs: null, as: null
      },
      {
        id: 5, week: 1, date: "2 Oct 2026", time: "9:30 pm", home: "TBC", away: "TBC",
        hs: null, as: null
      }
    ]

  }
  ,
  stats: {
    oneEighties: [{
      player: "John Cahill", team: "Walsh's A", total: 3
    }
    , {
      player: "Declan Fuery", team: "Bradley's A", total: 2
    }
    , {
      player: "Adrian Finn", team: "Walsh's B", total: 2
    }
    , {
      player: "Craig Molloy", team: "Dicey's Bar", total: 2
    }
    , {
      player: "Pete Cosgrove", team: "Bradley's A", total: 2
    }
    , {
      player: "Jamie Caughlan", team: "Walsh's A", total: 2
    }
    , {
      player: "Brendan Daly", team: "Mullins' A", total: 2
    }
    , {
      player: "Michael C Rabbitte", team: "Mullins' A", total: 1
    }
  ],
  checkouts: [{
    player: "Padraic Curley", team: "Hennelly's A", score: 170
  }
  , {
    player: "Jamie Caughlan", team: "Walsh's A", score: 164
  }
  , {
    player: "Greg McManus", team: "Walsh's B", score: 158
  }
  , {
    player: "Padraic Curley", team: "Hennelly's A", score: 156
  }
]

}

}
;
function setupMenu() {
  const button = document.querySelector(".menu-button");
  const nav = document.querySelector(".site-nav");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));

  }
);
function calculateStandings(teams, results) {
  const table = teams.map(team => ({
    team,
    p: 0,
    w: 0,
    l: 0,
    for: 0,
    against: 0,
    pts: 0
  }));

  results.forEach(result => {
    const home = table.find(row => row.team === result.home);
    const away = table.find(row => row.team === result.away);

    if (!home || !away) return;

    home.p++;
    away.p++;

    home.for += result.hs;
    home.against += result.as;

    away.for += result.as;
    away.against += result.hs;

    home.pts += result.hs;
    away.pts += result.as;

    if (result.hs > result.as) {
      home.w++;
      away.l++;
    } else {
      away.w++;
      home.l++;
    }
  });

  return table.sort((a, b) => {
    if (b.pts !== a.pts) {
      return b.pts - a.pts;
    }

    return (b.for - b.against) - (a.for - a.against);
  });
}

}
function resultCards(matches, league) {
  return matches.map(m => `<article class="match-card"><div class="match-meta">${
    league
  }
  - ${
    m.date
  }
  </div><div class="score-row"><strong>${
    m.home
  }
  </strong><span>${
    m.hs
  }
  - ${
    m.as
  }
  </span><strong>${
    m.away
  }
  </strong></div></article>`).join("");

}
function getResults(league) {
  return league.fixtures.filter(match =>
    match.hs !== null && match.as !== null
  );
}

function getUpcomingFixtures(league) {
  return league.fixtures.filter(match =>
    match.hs === null || match.as === null
  );
}

function calculateStandings(league) {
  const table = league.teams.map(team => ({
    team: team,
    p: 0,
    w: 0,
    l: 0,
    for: 0,
    against: 0,
    pts: 0
  }));

  const results = getResults(league);

  results.forEach(match => {
    const homeTeam = table.find(row => row.team === match.home);
    const awayTeam = table.find(row => row.team === match.away);

    if (!homeTeam || !awayTeam) {
      console.warn("Team not found for match:", match);
      return;
    }

    // Played
    homeTeam.p++;
    awayTeam.p++;

    // Scores for and against
    homeTeam.for += match.hs;
    homeTeam.against += match.as;

    awayTeam.for += match.as;
    awayTeam.against += match.hs;

    // League points
    homeTeam.pts += match.hs;
    awayTeam.pts += match.as;

    // Wins and losses
    if (match.hs > match.as) {
      homeTeam.w++;
      awayTeam.l++;
    } else if (match.as > match.hs) {
      awayTeam.w++;
      homeTeam.l++;
    }
  });

  table.sort((a, b) => {
    // First: points
    if (b.pts !== a.pts) {
      return b.pts - a.pts;
    }

    // Second: score difference
    const differenceA = a.for - a.against;
    const differenceB = b.for - b.against;

    if (differenceB !== differenceA) {
      return differenceB - differenceA;
    }

    // Third: scores for
    return b.for - a.for;
  });

  return table;
}
function fixtureCards(matches, league) {
  return matches.map(m => `<article class="match-card"><div class="match-meta">${
    league
  }
  - ${
    m.date
  }
  - ${
    m.time
  }
  </div><div class="fixture-row"><strong>${
    m.home
  }
  </strong><span>vs</span><strong>${
    m.away
  }
  </strong></div></article>`).join("");

}
function renderStandings(rows) {
  return `<div class="table-wrap"><table><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>L</th><th>+/-</th><th>Pts</th></tr></thead><tbody>${
    rows.map((r, i) => `<tr><td>${
      i + 1
    }
    </td><td><strong>${
      r.team
    }
    </strong></td><td>${
      r.p
    }
    </td><td>${
      r.w
    }
    </td><td>${
      r.l
    }
    </td><td>${
      r.for-r.against
    }
    </td><td><strong>${
      r.pts
    }
    </strong></td></tr>`).join("")
  }
  </tbody></table></div>`;

}
document.addEventListener("DOMContentLoaded", setupMenu);
