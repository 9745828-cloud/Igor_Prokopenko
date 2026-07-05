/**
 * main.js — навигация, рендер данных, интерактивность (без 3D).
 * 3D-сцена раздела "Медиа ДНК" вынесена в dna-scene.js.
 */
(function () {
  "use strict";

  const DATA = window.SITE_DATA;

  document.addEventListener("DOMContentLoaded", () => {
    renderTimeline();
    renderMethod();
    renderQna();
    renderPress();
    renderSocial();
    renderMystery();
    renderDnaFallback();

    initHeaderScroll();
    initMobileMenu();
    initNavActiveState();
    initReveal();
    initMysteryTabs();
    initQnaAccordion();
    initModal();
    initForms();
    initYear();
  });

  /* ============================== РЕНДЕР ============================== */

  function renderTimeline() {
    const root = document.getElementById("timeline-list");
    if (!root) return;
    root.innerHTML = DATA.timeline
      .map(
        (item, i) => `
      <div class="relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-10 items-center reveal" data-reveal>
        <div class="absolute left-0 md:left-1/2 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--gold)] timeline-dot z-10"></div>
        <div class="${i % 2 === 0 ? "md:text-right md:pr-12" : "md:order-2 md:pl-12"}">
          <span class="eyebrow">${escapeHtml(item.year)} · ${escapeHtml(item.tag)}</span>
          <h3 class="text-xl md:text-2xl font-serif-display mt-2 mb-2">${escapeHtml(item.title)}</h3>
          <p class="text-[var(--muted)] leading-relaxed">${escapeHtml(item.text)}</p>
        </div>
        <div class="${i % 2 === 0 ? "" : "md:order-1"} hidden md:block"></div>
      </div>`
      )
      .join("");
  }

  function renderMethod() {
    const root = document.getElementById("method-grid");
    if (!root) return;
    root.innerHTML = DATA.method
      .map(
        (m, i) => `
      <div class="method-card p-7 reveal" data-reveal style="transition-delay:${(i % 4) * 80}ms">
        <span class="text-[var(--gold)] font-serif-display text-3xl">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="text-lg font-serif-display mt-3 mb-2 text-white">${escapeHtml(m.title)}</h3>
        <p class="text-sm text-[var(--muted)] leading-relaxed">${escapeHtml(m.text)}</p>
      </div>`
      )
      .join("");
  }

  function renderQna() {
    const root = document.getElementById("qna-list");
    if (!root) return;
    root.innerHTML = DATA.qna
      .map(
        (item, i) => `
      <div class="qna-item border-b border-white/10 reveal" data-reveal>
        <button class="qna-toggle w-full flex items-center justify-between gap-4 py-5 text-left" aria-expanded="false">
          <span class="font-serif-display text-lg md:text-xl text-white">${escapeHtml(item.q)}</span>
          <svg class="chevron shrink-0 w-5 h-5 text-[var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="qna-answer">
          <p class="pb-6 text-[var(--muted)] leading-relaxed max-w-3xl">${escapeHtml(item.a)}</p>
        </div>
      </div>`
      )
      .join("");
  }

  function renderPress() {
    const root = document.getElementById("press-grid");
    if (!root) return;
    const stanceColor = {
      "признание": "text-emerald-300 border-emerald-300/30",
      "критика": "text-rose-300 border-rose-300/30",
      "дискуссия": "text-[var(--gold-light)] border-[var(--gold)]/30",
      "полемика": "text-rose-300 border-rose-300/30"
    };
    root.innerHTML = DATA.press
      .map(
        (p, i) => `
      <div class="press-card p-6 reveal" data-reveal style="transition-delay:${(i % 3) * 90}ms">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs uppercase tracking-widest text-[var(--muted)]">${escapeHtml(p.outlet)}</span>
          <span class="text-[10px] uppercase tracking-widest border rounded-full px-2 py-1 ${stanceColor[p.stance] || ""}">${escapeHtml(p.stance)}</span>
        </div>
        <p class="text-sm leading-relaxed text-[var(--ink)]">${escapeHtml(p.snippet)}</p>
      </div>`
      )
      .join("");
  }

  function renderSocial() {
    const roots = document.querySelectorAll("[data-social-root]");
    if (!roots.length) return;
    const icons = {
      youtube: '<path d="M22 8.4s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.3 5 12 5 12 5h0s-4.3 0-7.1.1c-.4.1-1.3.1-2.1 1C2.2 6.8 2 8.4 2 8.4S1.8 10.2 1.8 12v1.8c0 1.8.2 3.6.2 3.6s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.3.2 7.3.2v-4.6h0"/><path d="M10 15l5-3-5-3z" fill="currentColor" stroke="none"/>',
      telegram: '<path d="M22 2L2 10l6 2m14-10l-4 18-8-6m12-12L8 14"/>',
      vk: '<path d="M4 4c0 10 6 16 16 16"/><circle cx="12" cy="12" r="9"/>',
      ok: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M9 15l-2 2m10-2l2 2"/>'
    };
    roots.forEach((root) => {
      root.innerHTML = DATA.social
        .map(
          (s) => `
        <a href="${escapeAttr(s.href)}" target="_blank" rel="noopener" aria-label="${escapeAttr(s.name)}"
           class="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--gold)]/30 text-[var(--gold-light)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-4 h-4">${icons[s.icon] || ""}</svg>
        </a>`
        )
        .join("");
    });
  }

  /* ============================== ТАЙНА ДНЯ ============================== */

  function dayIndex(length) {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const dayOfYear = Math.floor(diff / 86400000);
    return dayOfYear % length;
  }

  function renderMystery() {
    const list = DATA.mysteryOfTheDay;
    const todayRoot = document.getElementById("mystery-today");
    const archiveRoot = document.getElementById("mystery-archive");
    if (!todayRoot || !archiveRoot) return;

    const idx = dayIndex(list.length);
    const today = list[idx];

    todayRoot.innerHTML = mysteryCard(today, true);

    archiveRoot.innerHTML = list
      .map((m, i) => `<div data-tag="${escapeAttr(m.tag)}" class="mystery-archive-item">${mysteryCard(m, i === idx)}</div>`)
      .join("");
  }

  function mysteryCard(m, isToday) {
    return `
      <div class="relative p-8 md:p-10 border border-[var(--gold)]/25 bg-gradient-to-br from-white/[0.04] to-transparent">
        ${isToday ? '<span class="eyebrow">Сегодня</span>' : `<span class="eyebrow">${escapeHtml(m.tag)}</span>`}
        <div class="flex items-baseline gap-3 mt-2 mb-4">
          <span class="text-3xl font-serif-display text-[var(--gold-light)]">${escapeHtml(m.year)}</span>
          <span class="text-xs uppercase tracking-widest text-[var(--muted)]">${escapeHtml(m.tag)}</span>
        </div>
        <p class="font-serif-display text-xl md:text-2xl leading-snug text-white mb-5">«${escapeHtml(m.quote)}»</p>
        <p class="text-sm text-[var(--muted)] leading-relaxed border-t border-white/10 pt-4">${escapeHtml(m.correlation)}</p>
      </div>`;
  }

  function initMysteryTabs() {
    const tabs = document.querySelectorAll(".tab-btn");
    const archiveWrap = document.getElementById("mystery-archive-wrap");
    const todayWrap = document.getElementById("mystery-today-wrap");
    const filterRoot = document.getElementById("mystery-tag-filters");
    if (!tabs.length) return;

    const tags = ["all", ...new Set(DATA.mysteryOfTheDay.map((m) => m.tag))];
    filterRoot.innerHTML = tags
      .map(
        (tag, i) => `<button class="tab-btn tag-filter-btn ${i === 0 ? "active" : ""}" data-filter="${escapeAttr(tag)}">${tag === "all" ? "Все темы" : escapeHtml(tag)}</button>`
      )
      .join("");

    filterRoot.querySelectorAll(".tag-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterRoot.querySelectorAll(".tag-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        document.querySelectorAll(".mystery-archive-item").forEach((el) => {
          el.style.display = filter === "all" || el.dataset.tag === filter ? "" : "none";
        });
      });
    });

    tabs.forEach((tab) => {
      if (!tab.dataset.view) return;
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          if (t.dataset.view) t.classList.remove("active");
        });
        tab.classList.add("active");

        if (tab.dataset.view === "today") {
          archiveWrap.classList.add("hidden");
          todayWrap.classList.remove("hidden");
        } else {
          todayWrap.classList.add("hidden");
          archiveWrap.classList.remove("hidden");
        }
      });
    });
  }

  /* ============================== DNA FALLBACK ============================== */

  function renderDnaFallback() {
    const root = document.getElementById("dna-fallback-grid");
    if (!root) return;
    root.innerHTML = DATA.dnaNodes
      .map(
        (n) => `
      <div class="method-card p-6 reveal" data-reveal data-node-id="${escapeAttr(n.id)}">
        <h3 class="font-serif-display text-lg text-white mb-2">${escapeHtml(n.label)}</h3>
        <p class="text-xs uppercase tracking-widest text-[var(--gold-light)] mb-3">${escapeHtml(n.short)}</p>
        <p class="text-sm text-[var(--muted)] leading-relaxed">${escapeHtml(n.text)}</p>
      </div>`
      )
      .join("");
    root.querySelectorAll("[data-node-id]").forEach((card) => {
      card.addEventListener("click", () => window.openDnaModal(card.dataset.nodeId));
    });
  }

  /* ============================== НАВИГАЦИЯ ============================== */

  function initHeaderScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;
    window.addEventListener("scroll", () => {
      header.classList.toggle("shadow-lg", window.scrollY > 40);
    });
  }

  function initMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;
    btn.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("flex");
      menu.classList.toggle("hidden", !isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.add("hidden");
        menu.classList.remove("flex");
      })
    );
  }

  function initNavActiveState() {
    const links = document.querySelectorAll(".nav-link");
    const sections = Array.from(links)
      .map((l) => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("active"));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ============================== SCROLL REVEAL ============================== */

  function initReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  /* ============================== ACCORDION ============================== */

  function initQnaAccordion() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".qna-toggle");
      if (!btn) return;
      const item = btn.closest(".qna-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".qna-item.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".qna-toggle").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  }

  /* ============================== MODAL (используется dna-scene.js) ============================== */

  function initModal() {
    const modal = document.getElementById("dna-modal");
    const closeBtn = document.getElementById("dna-modal-close");
    if (!modal) return;

    window.openDnaModal = function (nodeId) {
      const node = DATA.dnaNodes.find((n) => n.id === nodeId);
      if (!node) return;
      document.getElementById("dna-modal-title").textContent = node.label;
      document.getElementById("dna-modal-short").textContent = node.short;
      document.getElementById("dna-modal-text").textContent = node.text;
      document.getElementById("dna-modal-link").textContent = node.linkText + " →";
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    };

    function close() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    }

    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ============================== ФОРМЫ ============================== */

  function initForms() {
    setupForm("ask-form", "ask-form-success");
    setupForm("contact-form", "contact-form-success");
  }

  function setupForm(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // TODO: заменить на реальную отправку (см. README.md, раздел "Подключение форм").
      // Пример: fetch(form.dataset.endpoint, { method: "POST", body: new FormData(form) });

      form.classList.add("hidden");
      success?.classList.remove("hidden");
      form.reset();
    });
  }

  /* ============================== UTILS ============================== */

  function initYear() {
    const el = document.getElementById("current-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(str) {
    return escapeHtml(str);
  }
})();
