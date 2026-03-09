const CONTACT = {
  email: "contacto@nexgenflows.cl",
  whatsapp: "56936619216",
  whatsappVisible: "+56 9 3661 9216"
};

const setContactLinks = () => {
  const emailAnchors = ["contactEmailLink", "footerEmail"];
  const whatsappAnchors = ["contactWhatsappLink", "footerWhatsapp"];

  emailAnchors.forEach((id) => {
    const anchor = document.getElementById(id);
    if (!anchor) return;
    anchor.href = `mailto:${CONTACT.email}`;
    anchor.textContent = CONTACT.email;
  });

  whatsappAnchors.forEach((id) => {
    const anchor = document.getElementById(id);
    if (!anchor) return;
    anchor.href = `https://wa.me/${CONTACT.whatsapp}`;
    anchor.textContent = CONTACT.whatsappVisible;
  });
};

const setupMobileMenu = () => {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (nav.contains(target) || toggle.contains(target)) return;

    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
};

const quoteMessage = (formData) => {
  return [
    "Hola NexgenFlows Ingeniería, necesito una cotización:",
    "",
    `Nombre: ${formData.nombre}`,
    `Empresa: ${formData.empresa || "No informa"}`,
    `Correo: ${formData.correo}`,
    `Teléfono: ${formData.telefono}`,
    `Tipo de requerimiento: ${formData.tipo}`,
    "",
    "Detalle:",
    formData.mensaje,
    "",
    "Enviado desde nexgenflows.cl"
  ].join("\n");
};

const getFormData = (form) => {
  const raw = new FormData(form);
  return {
    nombre: (raw.get("nombre") || "").toString().trim(),
    empresa: (raw.get("empresa") || "").toString().trim(),
    correo: (raw.get("correo") || "").toString().trim(),
    telefono: (raw.get("telefono") || "").toString().trim(),
    tipo: (raw.get("tipo") || "").toString().trim(),
    mensaje: (raw.get("mensaje") || "").toString().trim()
  };
};

const showFeedback = (text, isError = false) => {
  const feedback = document.getElementById("formFeedback");
  if (!feedback) return;

  feedback.textContent = text;
  feedback.style.color = isError ? "#a52a2a" : "#0d3f53";
};

const setupQuoteForm = () => {
  const form = document.getElementById("quoteForm");
  const whatsappBtn = document.getElementById("sendWhatsapp");
  if (!form || !whatsappBtn) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      showFeedback("Completa todos los campos obligatorios.", true);
      return;
    }

    const data = getFormData(form);
    const subject = `Cotización - ${data.tipo} - ${data.nombre}`;
    const body = quoteMessage(data);
    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    showFeedback("Se abrió tu cliente de correo con la cotización lista para enviar.");
  });

  whatsappBtn.addEventListener("click", () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      showFeedback("Completa todos los campos obligatorios antes de enviar por WhatsApp.", true);
      return;
    }

    const data = getFormData(form);
    const message = quoteMessage(data);
    const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    showFeedback("WhatsApp se abrió en una nueva pestaña con tu solicitud preparada.");
  });
};

const setupReveals = () => {
  const revealed = document.querySelectorAll(".reveal");
  if (!revealed.length) return;

  revealed.forEach((el, idx) => {
    const delay = Math.min(idx * 40, 320);
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  revealed.forEach((el) => observer.observe(el));
};

const setupStickyEffects = () => {
  const header = document.querySelector(".site-header");
  const progress = document.getElementById("scrollProgress");
  if (!header || !progress) return;

  const update = () => {
    const scrolled = window.scrollY > 8;
    header.classList.toggle("is-scrolled", scrolled);

    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
};

const setupTiltCards = () => {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsHover || reducedMotion) return;

  const cards = document.querySelectorAll("[data-tilt]");
  cards.forEach((card) => {
    let frameId = 0;

    const handleMove = (event) => {
      if (!(event.currentTarget instanceof HTMLElement)) return;
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const rotateY = px * 6;
        const rotateX = py * -6;
        target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });
    };

    const reset = (event) => {
      if (!(event.currentTarget instanceof HTMLElement)) return;
      if (frameId) cancelAnimationFrame(frameId);
      event.currentTarget.style.transform = "";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", reset);
    card.addEventListener("blur", reset, true);
  });
};

const setupCounters = () => {
  const counters = document.querySelectorAll(".counter[data-count]");
  if (!counters.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const runCounter = (counter) => {
    const end = Number(counter.dataset.count || 0);
    if (!Number.isFinite(end)) return;

    if (reducedMotion) {
      counter.textContent = String(end);
      return;
    }

    const duration = 950;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(end * eased);
      counter.textContent = String(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
};

const setYear = () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
};

const init = () => {
  setContactLinks();
  setupMobileMenu();
  setupQuoteForm();
  setupReveals();
  setupStickyEffects();
  setupTiltCards();
  setupCounters();
  setYear();
};

document.addEventListener("DOMContentLoaded", init);

