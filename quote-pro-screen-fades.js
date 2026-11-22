(function () {
  "use strict";

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const customer = document.getElementById("customer");
  const admin = document.getElementById("admin");
  const steps = customer
    ? [...customer.querySelectorAll('[id^="step-"], #page1, #page2, #page3, #review, #done')]
    : [];
  const visible = node => node && !node.closest("[hidden], .hidden");

  function currentScreen() {
    if (visible(admin)) return admin;
    if (visible(customer)) return steps.find(visible) || customer;
    return document.body;
  }

  let screen = currentScreen();
  let animation;

  function fadeIn(node) {
    animation?.cancel();
    if (motion.matches || typeof node?.animate !== "function") return;
    animation = node.animate([{ opacity: 0.2 }, { opacity: 1 }], {
      duration: 150,
      easing: "ease-out"
    });
  }

  fadeIn(document.body);
  window.addEventListener("pageshow", event => {
    if (event.persisted) fadeIn(document.body);
  });
  motion.addEventListener?.("change", event => {
    if (event.matches) animation?.cancel();
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
