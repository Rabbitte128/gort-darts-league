document.addEventListener("DOMContentLoaded", () => {
  const s = LEAGUE_DATA.stats;
  const leaderboard = (rows, key) => `<ol class="leaderboard">${
    rows.map((r, i) => `<li><span class="rank">${
      i + 1
    }
    </span><span><strong>${
      r.player
    }
    </strong><small>${
      r.team
    }
    </small></span><strong class="stat-value">${
      r[key]
    }
    </strong></li>`).join("")
  }
  </ol>`;
  document.querySelector("#page-content").innerHTML = `<div class="stats-grid"><article class="panel"><h2>🎯 180 Leaderboard</h2>${
    leaderboard(s.oneEighties, "total")
  }
  </article><article class="panel"><h2>🔥 Highest Checkouts</h2>${
    leaderboard(s.checkouts, "score")
  }
  </article></div><aside class="notice"><strong>Prototype data</strong><p>These player statistics are placeholders.</p></aside>`;

}
);
