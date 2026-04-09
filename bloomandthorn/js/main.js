/* ============================================================
   Bloom & Thorn Florist — Main JavaScript
   INFO 0211 | Ayden Craigwell | 20240606
   ============================================================ */

"use strict";

/* ---- Hamburger / Mobile Nav ---- */
(function () {
  const ham = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav-links");
  if (!ham || !nav) return;

  ham.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    ham.setAttribute("aria-expanded", open);
    ham.querySelectorAll("span").forEach((s, i) => {
      if (open) {
        if (i === 0) s.style.transform = "rotate(45deg) translate(5px, 5px)";
        if (i === 1) s.style.opacity = "0";
        if (i === 2) s.style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        s.style.transform = "";
        s.style.opacity = "";
      }
    });
  });

  // Close on link click
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      ham.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ---- Active Nav Link ---- */
(function () {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
})();

/* ---- Hero Carousel ---- */
(function () {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const slides = carousel.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let current = 0;
  let timer;

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    carousel.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) =>
      d.classList.toggle("active", i === current)
    );
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    timer = setInterval(next, 5000);
  }
  function stopAuto() { clearInterval(timer); }

  document.querySelector(".carousel-arrow.next")?.addEventListener("click", () => { stopAuto(); next(); startAuto(); });
  document.querySelector(".carousel-arrow.prev")?.addEventListener("click", () => { stopAuto(); prev(); startAuto(); });
  dots.forEach((d, i) =>
    d.addEventListener("click", () => { stopAuto(); goTo(i); startAuto(); })
  );

  // Keyboard carousel
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { stopAuto(); next(); startAuto(); }
    if (e.key === "ArrowLeft")  { stopAuto(); prev(); startAuto(); }
  });

  startAuto();
  goTo(0);
})();

/* ---- Back to Top ---- */
(function () {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ---- Wishlist Toggle ---- */
document.querySelectorAll(".wishlist-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    btn.textContent = btn.classList.contains("active") ? "♥" : "♡";
    btn.setAttribute("aria-label", btn.classList.contains("active") ? "Remove from wishlist" : "Add to wishlist");
  });
});

/* ---- Product Filter ---- */
(function () {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card[data-category]");
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      products.forEach((p) => {
        if (cat === "all" || p.dataset.category === cat) {
          p.style.display = "";
        } else {
          p.style.display = "none";
        }
      });
    });
  });
})();

/* ---- Newsletter Form Validation ---- */
(function () {
  const form = document.querySelector(".newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.focus();
      input.style.border = "2px solid #c0392b";
      return;
    }
    input.style.border = "";
    input.value = "";
    showToast("Thanks! You're subscribed. Check your inbox for your 10% discount.");
  });
})();

/* ---- Toast Notification ---- */
function showToast(msg) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: var_css("--deep-green"),
    color: "#fff",
    padding: "0.85rem 1.75rem",
    borderRadius: "4px",
    fontFamily: "Open Sans, sans-serif",
    fontWeight: "600",
    fontSize: "0.95rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    zIndex: "9999",
    maxWidth: "90vw",
    textAlign: "center",
    opacity: "0",
    transition: "opacity 0.3s",
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => (toast.style.opacity = "1"));
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function var_css(v) {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}

/* ---- Contact Form Validation ---- */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const rules = {
    contactName:    { required: true, minLen: 2, label: "Full Name" },
    contactEmail:   { required: true, email: true, label: "Email" },
    contactSubject: { required: true, label: "Subject" },
    contactMessage: { required: true, minLen: 10, label: "Message" },
  };

  function validate(id) {
    const el   = document.getElementById(id);
    const msg  = document.getElementById(id + "Err");
    const rule = rules[id];
    let err = "";

    if (rule.required && !el.value.trim()) err = `${rule.label} is required.`;
    else if (rule.minLen && el.value.trim().length < rule.minLen)
      err = `${rule.label} must be at least ${rule.minLen} characters.`;
    else if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value))
      err = "Please enter a valid email address.";

    el.classList.toggle("error", !!err);
    el.classList.toggle("valid", !err && el.value.trim() !== "");
    if (msg) { msg.textContent = err; msg.classList.toggle("visible", !!err); }
    return !err;
  }

  Object.keys(rules).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("blur", () => validate(id));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(rules).map(validate).every(Boolean);
    if (allValid) {
      document.getElementById("contactSuccess").classList.add("visible");
      form.reset();
      Object.keys(rules).forEach((id) => {
        const el = document.getElementById(id);
        if (el) { el.classList.remove("valid", "error"); }
      });
      setTimeout(() => document.getElementById("contactSuccess").classList.remove("visible"), 5000);
    }
  });
})();

/* ---- Sign Up Form Validation ---- */
(function () {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const rules = {
    firstName:  { required: true, minLen: 2, label: "First Name" },
    lastName:   { required: true, minLen: 2, label: "Last Name" },
    signupEmail: { required: true, email: true, label: "Email" },
    phone:      { required: false, phone: true, label: "Phone" },
    password:   { required: true, minLen: 8, label: "Password" },
    confirmPw:  { required: true, match: "password", label: "Confirm Password" },
  };

  function validate(id) {
    const el   = document.getElementById(id);
    const msg  = document.getElementById(id + "Err");
    const rule = rules[id];
    if (!el || !rule) return true;
    let err = "";

    const v = el.value.trim();
    if (rule.required && !v) err = `${rule.label} is required.`;
    else if (v && rule.minLen && v.length < rule.minLen)
      err = `${rule.label} must be at least ${rule.minLen} characters.`;
    else if (v && rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      err = "Please enter a valid email address.";
    else if (v && rule.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(v))
      err = "Please enter a valid phone number.";
    else if (rule.match) {
      const other = document.getElementById(rule.match);
      if (v !== other?.value) err = "Passwords do not match.";
    }

    el.classList.toggle("error", !!err);
    el.classList.toggle("valid", !err && v !== "");
    if (msg) { msg.textContent = err; msg.classList.toggle("visible", !!err); }
    return !err;
  }

  // Live validation on blur
  Object.keys(rules).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("blur", () => validate(id));
  });

  // Password strength
  const pwInput = document.getElementById("password");
  const strengthFill = document.getElementById("strengthFill");
  const strengthLabel = document.getElementById("strengthLabel");

  if (pwInput && strengthFill) {
    pwInput.addEventListener("input", () => {
      const v = pwInput.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;

      const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#27ae60"];
      const labels = ["Weak", "Fair", "Good", "Strong"];
      strengthFill.style.width = `${score * 25}%`;
      strengthFill.style.background = colors[score - 1] || "#ddd";
      if (strengthLabel) strengthLabel.textContent = v ? labels[score - 1] || "" : "";
    });
  }

  // Toggle password visibility
  document.querySelectorAll(".toggle-pw").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const show = target.type === "password";
      target.type = show ? "text" : "password";
      btn.textContent = show ? "🙈" : "👁";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(rules).map(validate).every(Boolean);
    if (allValid) {
      document.getElementById("signupSuccess").classList.add("visible");
      form.reset();
      if (strengthFill) { strengthFill.style.width = "0"; }
      if (strengthLabel) strengthLabel.textContent = "";
      Object.keys(rules).forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("valid", "error");
      });
      setTimeout(() => document.getElementById("signupSuccess").classList.remove("visible"), 6000);
    }
  });
})();

/* ---- Add to Cart Feedback ---- */
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const orig = btn.textContent;
    btn.textContent = "✓ Added!";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1800);
  });
});
