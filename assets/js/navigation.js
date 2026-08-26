document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-button");
  const siteNav = document.querySelector(".site-nav");

  if (!menuButton || !siteNav) return;

  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
  });
});