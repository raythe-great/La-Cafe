/* =====================================================
   Script halaman utama (index.html)
   - Isi data dari config.js
   - Navbar scroll & hamburger
   - Animasi fade-in saat scroll
   (Menu & pemesanan ada di menu.js, WiFi ada di wifi.js)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  /* ---------- Isi teks & link dari config.js ---------- */
  bindCafeData();
  document.title = `${CAFE_DATA.name} - Cafe & Restoran`;

  // Jam operasional
  const hoursList = document.getElementById("hours");
  CAFE_DATA.hours.forEach((h) => {
    const li = el("li");
    li.append(el("span", "", h.day), el("strong", "", h.time));
    hoursList.appendChild(li);
  });

  // Google Maps
  document.getElementById("mapFrame").src =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(CAFE_DATA.map_query) +
    "&output=embed";

  // Tahun otomatis di footer
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Animasi fade-in (IntersectionObserver) ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

  /* ---------- Navbar: efek blur saat scroll ---------- */
  function handleScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ---------- Hamburger menu (mobile) ---------- */
  function setMenuOpen(open) {
    hamburger.classList.toggle("active", open);
    navLinks.classList.toggle("open", open);
    navbar.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  }
  hamburger.addEventListener("click", () => {
    setMenuOpen(!navLinks.classList.contains("open"));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenuOpen(false))
  );
});
