document.addEventListener("DOMContentLoaded", async () => {
  await window.RESULTS_READY;
  renderResultsSlider(
    LEAGUE_DATA.a,
    "A League",
    "#page-content"
  );
});
