document.addEventListener("DOMContentLoaded", () => {

  const standings = calculateStandings(LEAGUE_DATA.b);

  document.querySelector("#page-content").innerHTML =
    renderStandings(standings);

});