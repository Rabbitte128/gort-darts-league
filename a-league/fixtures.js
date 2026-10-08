document.addEventListener("DOMContentLoaded", async () => {
  await window.RESULTS_READY;
  renderFixtureSlider(
    LEAGUE_DATA.a,
    "A League",
    "#page-content"
  );
});
