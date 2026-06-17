// SolorElektro
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const yearLabel = document.querySelector("[data-year]");

// --- Мобильное меню ---
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mobileMenu.querySelectorAll("[data-close-menu]").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Год в футере ---
if (yearLabel) {
  yearLabel.textContent = new Date().getFullYear();
}

// --- Обработка формы заявки ---
const form = document.getElementById("leadForm");
if (form) {
  const status = form.querySelector("[data-form-status]");
  const submitBtn = form.querySelector("[data-submit]");

  const showStatus = (msg, type) => {
    if (!status) return;
    status.textContent = msg;
    status.hidden = false;
    status.className = "form-status " + (type === "ok" ? "is-ok" : "is-err");
  };

  const cleanPhone = (v) => v.replace(/[^\d+]/g, "");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = cleanPhone(form.phone.value.trim());

    if (name.length < 2) {
      showStatus("Пожалуйста, укажите ваше имя.", "err");
      form.name.focus();
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      showStatus("Проверьте номер телефона — кажется, он введён не полностью.", "err");
      form.phone.focus();
      return;
    }

    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        showStatus("Спасибо! Заявка отправлена — мы свяжемся с вами в ближайшее время.", "ok");
      } else {
        showStatus("Не удалось отправить заявку. Позвоните нам по телефону (017) 260-00-83.", "err");
      }
    } catch (err) {
      showStatus("Ошибка соединения. Позвоните нам по телефону (017) 260-00-83.", "err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
}

// --- Кнопка «наверх» ---
const toTop = document.querySelector("[data-to-top]");
if (toTop) {
  const onScroll = () => {
    if (window.scrollY > 600) toTop.hidden = false;
    else toTop.hidden = true;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- Активный пункт меню при скролле ---
const sections = ["services", "steps", "contacts"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
if (sections.length && navLinks.length && "IntersectionObserver" in window) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => obs.observe(s));
}
