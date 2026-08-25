function renderFixtureSlider(league, leagueName, containerSelector) {
  const allFixtures = league.fixtures;

  const weeks = [...new Set(allFixtures.map(match => match.week))]
    .sort((a, b) => a - b);

  let currentIndex = weeks.findIndex(week =>
    allFixtures.some(match =>
      match.week === week &&
      (match.hs === null || match.as === null)
    )
  );

  if (currentIndex === -1) {
    currentIndex = weeks.length - 1;
  }

  const container = document.querySelector(containerSelector);

  function renderWeek() {
    const currentWeek = weeks[currentIndex];

    const fixtures = allFixtures.filter(match =>
      match.week === currentWeek
    );

    const date = fixtures[0]?.date || "";

    container.innerHTML = `
      <div class="week-slider">

        <div class="week-navigation">

          <button
            id="previous-week"
            class="week-arrow"
            ${currentIndex === 0 ? "disabled" : ""}
            aria-label="Previous week"
          >
            &#10094;
          </button>

          <div class="week-heading">
            <h2>Week ${currentWeek}</h2>
            <p>${date}</p>
          </div>

          <button
            id="next-week"
            class="week-arrow"
            ${currentIndex === weeks.length - 1 ? "disabled" : ""}
            aria-label="Next week"
          >
            &#10095;
          </button>

        </div>

        <div class="card-grid">
          ${fixtureCards(fixtures, leagueName)}
        </div>

        <div class="week-counter">
          ${currentIndex + 1} / ${weeks.length}
        </div>

      </div>
    `;

    document
      .querySelector("#previous-week")
      .addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          renderWeek();
        }
      });

    document
      .querySelector("#next-week")
      .addEventListener("click", () => {
        if (currentIndex < weeks.length - 1) {
          currentIndex++;
          renderWeek();
        }
      });
  }

  renderWeek();
}


function renderResultsSlider(league, leagueName, containerSelector) {
  const allFixtures = league.fixtures;

  const completedWeeks = [
    ...new Set(
      allFixtures
        .filter(match =>
          match.hs !== null &&
          match.as !== null
        )
        .map(match => match.week)
    )
  ].sort((a, b) => a - b);

  const container = document.querySelector(containerSelector);

  if (completedWeeks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No results yet</h2>
        <p>Results will appear here once matches have been played.</p>
      </div>
    `;
    return;
  }

  let currentIndex = completedWeeks.length - 1;

  function renderWeek() {
    const currentWeek = completedWeeks[currentIndex];

    const results = allFixtures.filter(match =>
      match.week === currentWeek &&
      match.hs !== null &&
      match.as !== null
    );

    const date = results[0]?.date || "";

    container.innerHTML = `
      <div class="week-slider">

        <div class="week-navigation">

          <button
            id="previous-week"
            class="week-arrow"
            ${currentIndex === 0 ? "disabled" : ""}
            aria-label="Previous week's results"
          >
            &#10094;
          </button>

          <div class="week-heading">
            <h2>Week ${currentWeek}</h2>
            <p>${date}</p>
          </div>

          <button
            id="next-week"
            class="week-arrow"
            ${currentIndex === completedWeeks.length - 1 ? "disabled" : ""}
            aria-label="Next week's results"
          >
            &#10095;
          </button>

        </div>

        <div class="card-grid">
          ${resultCards(results, leagueName)}
        </div>

        <div class="week-counter">
          Week ${currentWeek}
        </div>

      </div>
    `;

    document
      .querySelector("#previous-week")
      .addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          renderWeek();
        }
      });

    document
      .querySelector("#next-week")
      .addEventListener("click", () => {
        if (currentIndex < completedWeeks.length - 1) {
          currentIndex++;
          renderWeek();
        }
      });
  }

  renderWeek();
}