
(() => {
  "use strict";
  const menuButton = document.querySelector(".ve-menu-toggle");
  const nav = document.querySelector(".ve-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menuButton.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.innerHTML = '<i class="bi bi-list"></i>';
    }));
  }
  const properties = [...document.querySelectorAll(".ve-property")];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const searchForm = document.getElementById("property-search");
  const count = document.getElementById("property-count");
  const empty = document.getElementById("no-results");
  let activeFilter = "all";
  function applyFilters() {
    const type = document.getElementById("search-type")?.value || "all";
    const kind = document.getElementById("search-kind")?.value || "all";
    const beds = document.getElementById("search-beds")?.value || "all";
    const location = (document.getElementById("search-location")?.value || "").trim().toLowerCase();
    let visible = 0;
    properties.forEach(card => {
      const matchesType = (type === "all" || card.dataset.type === type) && (activeFilter === "all" || card.dataset.type === activeFilter);
      const matchesKind = kind === "all" || card.dataset.kind === kind;
      const matchesBeds = beds === "all" || Number(card.dataset.beds || 0) >= Number(beds);
      const matchesLocation = !location || (card.dataset.location || "").toLowerCase().includes(location);
      const show = matchesType && matchesKind && matchesBeds && matchesLocation;
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = `Showing ${visible} ${visible === 1 ? "property" : "properties"}`;
    if (empty) empty.hidden = visible !== 0;
  }
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    applyFilters();
  }));
  if (searchForm) searchForm.addEventListener("submit", event => {
    event.preventDefault();
    activeFilter = "all";
    filterButtons.forEach(item => item.classList.toggle("active", item.dataset.filter === "all"));
    applyFilters();
    document.getElementById("featured")?.scrollIntoView({behavior:"smooth", block:"start"});
  });
  document.getElementById("reset-search")?.addEventListener("click", () => {
    searchForm?.reset();
    activeFilter = "all";
    filterButtons.forEach(item => item.classList.toggle("active", item.dataset.filter === "all"));
    applyFilters();
  });
  document.querySelectorAll(".ve-favourite").forEach(button => button.addEventListener("click", () => {
    const saved = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(saved));
    button.innerHTML = saved ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>';
    button.setAttribute("aria-label", `${saved ? "Remove saved" : "Save"} ${button.getAttribute("aria-label").replace(/^(Save|Remove saved) /, "")}`);
  }));
  const topButton = document.querySelector(".ve-back-top");
  const updateTop = () => topButton?.classList.toggle("visible", window.scrollY > 500);
  window.addEventListener("scroll", updateTop, {passive:true});
  updateTop();
  topButton?.addEventListener("click", event => { event.preventDefault(); window.scrollTo({top:0,behavior:"smooth"}); });
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
  if (window.AOS) AOS.init({duration:700,easing:"ease-out-cubic",once:true,offset:60});
  applyFilters();
})();
