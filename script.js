const header = document.querySelector(".site-header");
const year = document.querySelector("#year");

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

year.textContent = new Date().getFullYear();
updateHeader();

window.addEventListener("scroll", updateHeader, { passive: true });
