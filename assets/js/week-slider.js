function renderFixtureSlider(league, leagueName, containerSelector) {
  // Matches still to play, plus each unfinished week's BYEs.
  // Once a week's results are all in, the whole week (BYEs included) disappears.
  const allFixtures = getUpcomingFixtures(league);

  const weeks = [...new Set(allFixtures.map(match => match.week))]
    .sort((a, b) => a - b);

  let currentIndex = 0;

  const container = document.querySelector(containerSelector);

  if (weeks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No fixtures remaining</h2>
        <p>All ${leagueName} matches have been played.</p>
      </div>
    `;
    return;
  }

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

          <div class="week-nav-right">

            <button
              id="next-week"
              class="week-arrow"
              ${currentIndex === weeks.length - 1 ? "disabled" : ""}
              aria-label="Next week"
            >
              &#10095;
            </button>

            <button
              id="last-week"
              class="week-arrow week-arrow-double"
              ${currentIndex === weeks.length - 1 ? "disabled" : ""}
              aria-label="Jump to last week"
            >
              &#10095;&#10095;
            </button>

          </div>

        </div>

        <div class="card-grid">
          ${fixtureCards(fixtures, leagueName)}
        </div>
        <div class="week-counter">
          <span>${currentIndex + 1} / ${weeks.length}</span>
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
      document
        .querySelector("#last-week")
        .addEventListener("click", () => {
          currentIndex = weeks.length - 1;
          renderWeek();
        });
        }

  renderWeek();
}


function renderResultsSlider(league, leagueName, containerSelector) {
  const allFixtures = getResults(league); // played matches only, never BYEs

  const completedWeeks = [
    ...new Set(allFixtures.map(match => match.week))
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

    const results = allFixtures.filter(match => match.week === currentWeek);

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

          <div class="week-nav-right">
            <button
              id="next-week"
              class="week-arrow"
              ${currentIndex === completedWeeks.length - 1 ? "disabled" : ""}
              aria-label="Next week's results"
            >
              &#10095;
            </button>
          </div>

        </div>

        <div class="card-grid">
          ${resultCards(results, leagueName)}
        </div>

        <div class="week-counter">
          <span>${currentIndex + 1} / ${completedWeeks.length}</span>
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
