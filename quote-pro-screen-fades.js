(function () {
  "use strict";

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const page = document.querySelector("body > .app, body > .wrap") || document.body;
  const customer = document.getElementById("customer");
  const admin = document.getElementById("admin");
  const steps = customer
    ? [...customer.querySelectorAll('[id^="step-"], #page1, #page2, #page3, #review, #done')]
    : [];
  const visible = node => node && !node.closest("[hidden], .hidden");
  const directory = new URL(".", location.href).pathname;

  function currentScreen() {
    if (visible(admin)) return admin;
    if (visible(customer)) return steps.find(visible) || customer;
    return page;
  }

  let screen = currentScreen();
  let animation;
  let leaving = false;

  function canFade(node) {
    return !motion.matches && typeof node.animate === "function";
  }

  function fadeIn(node) {
    if (leaving) return;
    animation?.cancel();
    if (!canFade(node)) return;
    animation = node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 230,
      delay: 25,
      fill: "backwards",
      easing: "ease-out"
    });
  }

  fadeIn(page);
  window.addEventListener("pageshow", event => {
    if (!event.persisted) return;
    leaving = false;
    fadeIn(page);
  });
  motion.addEventListener?.("change", event => {
    if (event.matches) animation?.cancel();
  });

  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || !canFade(page)) return;
    const link = event.target.closest?.("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(directory) ||
        (url.pathname !== directory && !url.pathname.endsWith(".html")) ||
        (url.pathname === location.pathname && url.search === location.search)) return;

    event.preventDefault();
    if (leaving) return;
    leaving = true;
    animation?.cancel();
    animation = page.animate([{ opacity: 1 }, { opacity: 0.25 }], {
      duration: 85,
      fill: "forwards",
      easing: "ease-in"
    });
    const navigate = () => location.assign(url.href);
    animation.finished.then(navigate, navigate);
  });

  const observer = new MutationObserver(() => {
    const next = currentScreen();
    if (next === screen) return;
    const returnsToCustomer = screen === admin && visible(customer);
    screen = next;
    fadeIn(returnsToCustomer ? customer : screen);
  });
  for (const node of [customer, admin, ...steps]) {
    if (node) observer.observe(node, { attributes: true, attributeFilter: ["class", "hidden"] });
  }
})();
