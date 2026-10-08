document.addEventListener("DOMContentLoaded", async () => {
  await window.RESULTS_READY;
  renderResultsSlider(
    LEAGUE_DATA.b,
    "B League",
    "#page-content"
  );
});
