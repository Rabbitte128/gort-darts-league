document.addEventListener("DOMContentLoaded", async () => {
  await window.RESULTS_READY;
  renderFixtureSlider(
    LEAGUE_DATA.b,
    "B League",
    "#page-content"
  );
});
