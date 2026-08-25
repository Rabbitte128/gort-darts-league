document.addEventListener("DOMContentLoaded", () => {

  // Latest A League results
  const aResults = getResults(LEAGUE_DATA.a)
    .slice(-2)
    .reverse()
    .map(match => ({
      ...match,
      league: "A League"
    }));

  // Latest B League results
  const bResults = getResults(LEAGUE_DATA.b)
    .slice(-2)
    .reverse()
    .map(match => ({
      ...match,
      league: "B League"
    }));

  const results = [
    ...aResults,
    ...bResults
  ];

  document.querySelector("#home-results").innerHTML =
    results
      .map(match => resultCards([match], match.league))
      .join("");


  // Next A League fixtures
  const aFixtures = getUpcomingFixtures(LEAGUE_DATA.a)
    .slice(0, 2)
    .map(match => ({
      ...match,
      league: "A League"
    }));

  // Next B League fixtures
  const bFixtures = getUpcomingFixtures(LEAGUE_DATA.b)
    .slice(0, 2)
    .map(match => ({
      ...match,
      league: "B League"
    }));

  const fixtures = [
    ...aFixtures,
    ...bFixtures
  ];

  document.querySelector("#home-fixtures").innerHTML =
    fixtures
      .map(match => fixtureCards([match], match.league))
      .join("");

});