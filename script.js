// Muhammad Qaisar portfolio — plain JavaScript
"use strict";

// Replace this placeholder with your real email address.
const CONTACT_EMAIL = "muhammadqaisar2009@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = [...document.querySelectorAll("main section[id]")];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. Mobile navigation

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu"
    );

    navLinks?.classList.toggle("is-open", !isOpen);
  });

  // Close the mobile menu after clicking a navigation link.
  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Escape closes the menu.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Close the mobile menu when returning to desktop width.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  // 2. Smooth scrolling

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(
        link.getAttribute("href")
      );

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  // 3. Highlight the current navigation section

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navItems.forEach((link) => {
            const active =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", active);

            if (active) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // 4. Reveal elements as the user scrolls

  const revealItems = document.querySelectorAll(".reveal");

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  }
  // 5. Animated role text

  const roleText = document.getElementById("role-text");

  const roles = [
    "Front-End Development",
    "Responsive Web Design",
    "UI/UX Design"
  ];

  if (roleText && !reducedMotion) {
    let roleIndex = 0;

    window.setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.textContent = roles[roleIndex];
    }, 2600);
  }

  // 6. Project category filters

  const filterButtons =
    document.querySelectorAll(".filter-button");

  const projectCards =
    document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;

        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      projectCards.forEach((card) => {
        const visible =
          selected === "all" ||
          card.dataset.category === selected;

        card.classList.toggle("is-hidden", !visible);
      });
    });
  });

  // 7. Set the email address displayed on the page

  const emailLink = document.getElementById("email-link");

  if (emailLink) {
    emailLink.textContent = CONTACT_EMAIL;
    emailLink.href = `mailto:${CONTACT_EMAIL}`;
  }

  // 8. Copy email address to clipboard

  const copyButton = document.getElementById("copy-email");

  copyButton?.addEventListener("click", async () => {
    const originalText = copyButton.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        // Fallback for browsers without Clipboard API support.
        const temporary = document.createElement("textarea");

        temporary.value = CONTACT_EMAIL;
        temporary.setAttribute("readonly", "");
        temporary.style.position = "absolute";
        temporary.style.left = "-9999px";

        document.body.appendChild(temporary);
        temporary.select();

        const copied = document.execCommand("copy");

        temporary.remove();

        if (!copied) {
          throw new Error("Copy command unavailable");
        }
      }

      copyButton.textContent = "Copied!";
    } catch {
      copyButton.textContent = "Select email";

      if (emailLink) {
        const range = document.createRange();
        range.selectNodeContents(emailLink);

        const selection = window.getSelection();

        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }

    window.setTimeout(() => {
      copyButton.textContent = originalText;
    }, 1800);
  });

  // 9. Contact form validation and email fallback

  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form || !feedback) return;

    feedback.classList.remove("error");

    if (!form.checkValidity()) {
      form.reportValidity();

      feedback.textContent =
        "Please complete each field with a valid email address.";

      feedback.classList.add("error");
      return;
    }

    // Do not pretend that an unconfigured email has been sent.
    if (CONTACT_EMAIL ==="your.email@example.com") {
      feedback.textContent =
        ".";

      feedback.classList.add("error");
      return;
    }

    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const sender = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    const body =
      `Name: ${name}\n` +
      `Reply email: ${sender}\n\n` +
      message;

    feedback.textContent =
      "Opening your email app with the message details. Review and send it there.";

    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
  
  // Back to Top button
  const backToTop = document.querySelector(".back-top");

  backToTop?.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });


  // 10. Automatically update the copyright year

  const year = document.getElementById("current-year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
});