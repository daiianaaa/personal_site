function setYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }
  
  function setupMobileNav() {
    const btn = document.querySelector(".nav-toggle");
    const nav = document.getElementById("primary-nav");
    if (!btn || !nav) return;
  
    const toggle = (force) => {
      const isOpen =
        typeof force === "boolean"
          ? force
          : btn.getAttribute("aria-expanded") !== "true";
  
      btn.setAttribute("aria-expanded", String(isOpen));
      nav.classList.toggle("is-open", isOpen);
    };
  
    btn.addEventListener("click", () => toggle());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggle(false);
    });
  
    // închide meniul când dai click pe un link (pe mobile)
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) toggle(false);
    });
  }
  
  function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
  
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");
    const emailErr = form.querySelector("#email-error");
    const msgErr = form.querySelector("#message-error");
    const status = form.querySelector("#form-status");
  
    const isValidEmail = (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
    const isValidMessage = (v) => String(v || "").trim().length >= 10;
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const okEmail = isValidEmail(email.value);
      const okMsg = isValidMessage(message.value);
  
      if (emailErr) emailErr.textContent = okEmail ? "" : "Please enter a valid email.";
      if (msgErr) msgErr.textContent = okMsg ? "" : "Message must be at least 10 characters.";
      if (status) status.textContent = "";
  
      if (okEmail && okMsg) {
        if (status) status.textContent = "Message ready to send ✅";
        form.reset();
      }
    });
  }
  
  // ===== Simple SPA navigation (hash-based) =====
  function setupSPA() {
    const pages = document.querySelectorAll(".right-panel .page");
    const navLinks = document.querySelectorAll('#primary-nav a[href^="#"]');
    const rightPanel = document.querySelector(".right-panel");
  
    if (!pages.length || !navLinks.length) return;
  
    function setActivePage(hash) {
      const id = (hash || "#about").replace("#", "");
  
      const exists = Array.from(pages).some((p) => p.id === id);
      const targetId = exists ? id : "about";
  
      pages.forEach((p) => p.classList.toggle("is-active", p.id === targetId));
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${targetId}`)
      );
  
      if (rightPanel) rightPanel.scrollTo({ top: 0, behavior: "smooth" });
    }
  
    navLinks.forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.hash = a.getAttribute("href");
      });
    });
  
    window.addEventListener("hashchange", () => setActivePage(window.location.hash));
    setActivePage(window.location.hash);
  }
  function setupFlipStats() {
    const cards = document.querySelectorAll(".stat.flip");
    if (!cards.length) return;
  
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        // dacă vrei să fie deschis DOAR unul la un moment dat:
        cards.forEach((c) => {
          if (c !== card) {
            c.classList.remove("is-flipped");
            c.setAttribute("aria-expanded", "false");
          }
        });
  
        const willFlip = !card.classList.contains("is-flipped");
        card.classList.toggle("is-flipped", willFlip);
        card.setAttribute("aria-expanded", String(willFlip));
      });
    });
  }
  function setupStatsZoom() {
    const stats = document.querySelector(".stats");
    if (!stats) return;
  
    let overlay = document.querySelector(".stats-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "stats-overlay";
      document.body.appendChild(overlay);
    }
  
    const cards = stats.querySelectorAll(".stat");
    let openCard = null;
  
    const close = () => {
      if (!openCard) return;
  
      // scoatem animatia "in"
      openCard.classList.remove("is-in");
  
      // dupa tranzitie, curatam
      setTimeout(() => {
        if (openCard) openCard.classList.remove("zoomed");
        overlay.classList.remove("is-open");
        document.body.style.overflow = "";
        openCard = null;
      }, 220);
    };
  
    const open = (card) => {
      // daca era altul deschis, inchide-l instant
      if (openCard && openCard !== card) {
        openCard.classList.remove("zoomed", "is-in");
        openCard = null;
      }
  
      openCard = card;
      overlay.classList.add("is-open");
      card.classList.add("zoomed");
      document.body.style.overflow = "hidden";
  
      // trigger animatie "in"
      requestAnimationFrame(() => card.classList.add("is-in"));
    };
  
    cards.forEach(card => {
      card.style.cursor = "pointer";
      card.addEventListener("click", (e) => {
        e.stopPropagation();
        if (card.classList.contains("zoomed")) close();
        else open(card);
      });
    });
  
    overlay.addEventListener("click", close);
  
    // IMPORTANT: NU mai avem ESC
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    setupMobileNav();
    setupContactForm();
    setupSPA();
    setupFlipStats();
    setupStatsZoom();
  });