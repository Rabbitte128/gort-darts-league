document.addEventListener("DOMContentLoaded", async () => {
  await window.RESULTS_READY;

  const standings = calculateStandings(LEAGUE_DATA.a);

  document.querySelector("#page-content").innerHTML =
    renderStandings(standings);

});
