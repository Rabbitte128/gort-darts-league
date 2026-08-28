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
      "TBC",
      "Walsh's A"
    ],
    fixtures: [
      // Week 1
      {
        id: 1, week: 1, date: "9 Oct 2026", time: "9:30 pm", home: "Dicey's A", away: "Dicey's B",
        hs: null, as: null
      },
      {
        id: 2, week: 1, date: "9 Oct 2026", time: "9:30 pm", home: "Hennelly's A", away: "Hennelly's B",
        hs: null, as: null
      },
      {
        id: 3, week: 1, date: "9 Oct 2026", time: "9:30 pm", home: "Walsh's A", away: "TBC",
        hs: null, as: null
      },
      {
        id: 4, week: 1, date: "9 Oct 2026", time: "9:30 pm", away: "Mullins' A", home: "Bradley's A",
        hs: null, as: null
      },
      // Week 2
      {
        id: 5, week: 2, date: "16 Oct 2026", time: "9:30 pm", home: "Hennelly's A", away: "TBC",
        hs: null, as: null
      },
      {
        id: 6, week: 2, date: "16 Oct 2026", time: "9:30 pm", home: "Walsh's A", away: "Bradley's A",
        hs: null, as: null
      },
      {
        id: 7, week: 2, date: "16 Oct 2026", time: "9:30 pm", home: "Dicey's A", away: "Hennelly's B",
        hs: null, as: null
      },
      {
        id: 8, week: 2, date: "16 Oct 2026", time: "9:30 pm", home: "Mullins' A", away: "Dicey's B",
        hs: null, as: null
      },
      // Week 3
      {
        id: 9, week: 3, date: "23 Oct 2026", time: "9:30 pm", home: "TBC", away: "Bradley's A",
        hs: null, as: null
      },
      {
        id: 10, week: 3, date: "23 Oct 2026", time: "9:30 pm", away: "Hennelly's A", home: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 11, week: 3, date: "23 Oct 2026", time: "9:30 pm", away: "Dicey's B", home: "Walsh's A",
        hs: null, as: null
      },
      {
        id: 12, week: 3, date: "23 Oct 2026", time: "9:30 pm", away: "Mullins' A", away: "Hennelly's B",
        hs: null, as: null
      },
      // Week 4
      {
        id: 13, week: 4, date: "13 Nov 2026", time: "9:30 pm", home: "TBC", away: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 14, week: 4, date: "13 Nov 2026", time: "9:30 pm", home: "Dicey's B", away: "Bradley's A",
        hs: null, as: null
      },
      {
        id: 15, week: 4, date: "13 Nov 2026", time: "9:30 pm", home: "Mullins' A", away: "Hennelly's A",
        hs: null, as: null
      },
      {
        id: 16, week: 4, date: "13 Nov 2026", time: "9:30 pm", home: "Hennelly's B", away: "Walsh's A",
        hs: null, as: null
      },
      // Week 5
      {
        id: 17, week: 5, date: "20 Nov 2026", time: "9:30 pm", home: "Dicey's B", away: "TBC",
        hs: null, as: null
      },
      {
        id: 18, week: 5, date: "20 Nov 2026", time: "9:30 pm", home: "Mullins' A", away: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 19, week: 5, date: "20 Nov 2026", time: "9:30 pm", away: "Hennelly's B", home: "Bradley's A",
        hs: null, as: null
      },
      {
        id: 20, week: 5, date: "20 Nov 2026", time: "9:30 pm", away: "Walsh's A", home: "Hennelly's A",
        hs: null, as: null
      },
      // Week 6
      {
        id: 21, week: 6, date: "27 Nov 2026", time: "9:30 pm", away: "Mullins' A", home: "TBC",
        hs: null, as: null
      },
      {
        id: 22, week: 6, date: "27 Nov 2026", time: "9:30 pm", away: "Dicey's B", home: "Hennelly's B",
        hs: null, as: null
      },
      {
        id: 23, week: 6, date: "27 Nov 2026", time: "9:30 pm", away: "Walsh's A", home: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 24, week: 6, date: "27 Nov 2026", time: "9:30 pm", away: "Hennelly's A", home: "Bradley's A",
        hs: null, as: null
      },
      // Week 7
      {
        id: 25, week: 7, date: "4 Dec 2026", time: "9:30 pm", home: "TBC", away: "Hennelly's B",
        hs: null, as: null
      },
      {
        id: 26, week: 7, date: "4 Dec 2026", time: "9:30 pm", home: "Mullins' A", away: "Walsh's A",
        hs: null, as: null
      },
      {
        id: 27, week: 7, date: "4 Dec 2026", time: "9:30 pm", home: "Hennelly's A", away: "Dicey's B",
        hs: null, as: null
      },
      {
        id: 28, week: 7, date: "4 Dec 2026", time: "9:30 pm", home: "Dicey's A", away: "Bradley's A",
        hs: null, as: null
      },
      // Week 8
      {
        id: 29, week: 8, date: "11 Dec 2026", time: "9:30 pm", home: "Dicey's A", away: "Dicey's B",
        hs: null, as: null
      },
      {
        id: 30, week: 8, date: "11 Dec 2026", time: "9:30 pm", away: "Hennelly's A", home: "Hennelly's B",
        hs: null, as: null
      },
      {
        id: 31, week: 8, date: "11 Dec 2026", time: "9:30 pm", away: "Walsh's A", home: "TBC",
        hs: null, as: null
      },
      {
        id: 32, week: 8, date: "11 Dec 2026", time: "9:30 pm", home: "Mullins' A", away: "Bradley's A",
        hs: null, as: null
      },
      // Week 9
      {
        id: 33, week: 9, date: "8 Jan 2026", time: "9:30 pm", away: "Hennelly's A", home: "TBC",
        hs: null, as: null
      },
      {
        id: 34, week: 9, date: "8 Jan 2026", time: "9:30 pm", away: "Walsh's A", home: "Bradley's A",
        hs: null, as: null
      },
      {
        id: 35, week: 9, date: "8 Jan 2026", time: "9:30 pm", away: "Dicey's A", home: "Hennelly's B",
        hs: null, as: null
      },
      {
        id: 36, week: 9, date: "8 Jan 2026", time: "9:30 pm", away: "Mullins' A", home: "Dicey's B",
        hs: null, as: null
      },
      // Week 10 R3
      {
        id: 37, week: 10, date: "15 Jan 2026", time: "9:30 pm", away: "TBC", home: "Bradley's A",
        hs: null, as: null
      },
      {
        id: 38, week: 10, date: "15 Jan 2026", time: "9:30 pm", home: "Hennelly's A", away: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 39, week: 10, date: "15 Jan 2026", time: "9:30 pm", home: "Dicey's B", away: "Walsh's A",
        hs: null, as: null
      },
      {
        id: 40, week: 10, date: "15 Jan 2026", time: "9:30 pm", home: "Mullins' A", away: "Hennelly's B",
        hs: null, as: null
      },
      // Week 11 R4
      {
        id: 41, week: 11, date: "22 Jan 2026", time: "9:30 pm", away: "TBC", home: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 42, week: 11, date: "22 Jan 2026", time: "9:30 pm", away: "Dicey's B", home: "Bradley's A",
        hs: null, as: null
      },
      {
        id: 43, week: 11, date: "22 Jan 2026", time: "9:30 pm", away: "Mullins' A", home: "Hennelly's A",
        hs: null, as: null
      },
      {
        id: 44, week: 11, date: "22 Jan 2026", time: "9:30 pm", away: "Hennelly's B", home: "Walsh's A",
        hs: null, as: null
      },
      // Week 12 R5
      {
        id: 45, week: 12, date: "29 Jan 2026", time: "9:30 pm", away: "Dicey's B", home: "TBC",
        hs: null, as: null
      },
      {
        id: 46, week: 12, date: "29 Jan 2026", time: "9:30 pm", away: "Mullins' A", home: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 47, week: 12, date: "29 Jan 2026", time: "9:30 pm", home: "Hennelly's B", away: "Bradley's A",
        hs: null, as: null
      },
      {
        id: 48, week: 12, date: "29 Jan 2026", time: "9:30 pm", home: "Walsh's A", away: "Hennelly's A",
        hs: null, as: null
      },
      // Week 13
      {
        id: 49, week: 13, date: "19 Feb 2026", time: "9:30 pm", away: "Mullins' A", home: "TBC",
        hs: null, as: null
      },
      {
        id: 50, week: 13, date: "19 Feb 2026", time: "9:30 pm", home: "Dicey's B", away: "Hennelly's B",
        hs: null, as: null
      },
      {
        id: 51, week: 13, date: "19 Feb 2026", time: "9:30 pm", home: "Walsh's A", away: "Dicey's A",
        hs: null, as: null
      },
      {
        id: 52, week: 13, date: "19 Feb 2026", time: "9:30 pm", home: "Hennelly's A", away: "Bradley's A",
        hs: null, as: null
      },
      // Week 14
      {
        id: 53, week: 14, date: "26 Feb 2026", time: "9:30 pm", away: "TBC", home: "Hennelly's B",
        hs: null, as: null
      },
      {
        id: 54, week: 14, date: "26 Feb 2026", time: "9:30 pm", away: "Mullins' A", home: "Walsh's A",
        hs: null, as: null
      },
      {
        id: 55, week: 14, date: "26 Feb 2026", time: "9:30 pm", away: "Hennelly's A", home: "Dicey's B",
        hs: null, as: null
      },
      {
        id: 56, week: 14, date: "26 Feb 2026", time: "9:30 pm", away: "Dicey's A", home: "Bradley's A",
        hs: null, as: null
      },
      // Week 15
      {
        id: 57, week: 15, date: "12 Mar 2026", time: "9:30 pm", away: "Semi-Final 1", home: "Semi-Final 1",
        hs: null, as: null
      },
      {
        id: 58, week: 15, date: "12 Mar 2026", time: "9:30 pm", away: "Semi-Final 1", home: "Semi-Final 1",
        hs: null, as: null
      },
      // Week 16
      {
        id: 59, week: 16, date: "26 Mar 2026", time: "9:30 pm", away: "Semi-Final 2", home: "Semi-Final 2",
        hs: null, as: null
      },
      {
        id: 60, week: 16, date: "26 Mar 2026", time: "9:30 pm", away: "Semi-Final 2", home: "Semi-Final 2",
        hs: null, as: null
      },
      // Week 17
      {
        id: 61, week: 17, date: "10 Apr 2026", time: "7 pm", away: "Final", home: "Final",
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
      "Hennelly's C",
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
