// clock.js
window.clock = window.clock || 0;

window.incrementClock = function () {
  window.clock++;
  console.log("[clock.js] Clock =", window.clock);

  if (typeof window.actualizarVistaEjeX === "function") {
    window.actualizarVistaEjeX();
  }
};

// Compatible con tu onclick="selectOption('Clock', event)"
window.selectOption = function (option, event) {
  if (option === "Clock") {
    window.incrementClock();
  }
};
