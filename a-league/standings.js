document.addEventListener("DOMContentLoaded", () => {

  const standings = calculateStandings(LEAGUE_DATA.a);

  document.querySelector("#page-content").innerHTML =
    renderStandings(standings);

});