window.clock = window.clock || 0;

window.incrementClock = function () {
  window.clock++;
  addClockColumn(window.clock);  // llamar la función que añade la columna
};


window.selectOption = function(option, event) {
    if (option === "ClockFCFS") {
        window.incrementClock();
        pintarDesdeEstructura();
    }

    if (option === "ClockSJF") {
        window.incrementClock();
        pintarDesdeEstructura();

    }

    if (option === "ClockSRTF") {
        window.incrementClock();
        pintarDesdeEstructura();

    }

    if (option === "ClockRR") {
        window.incrementClock();
        pintarDesdeEstructura();

    }

    if (option === "Prueba") {
    console.log("Probando color…");
    agregarColorNodo(1, 1, "red");
    agregarColorNodo(1, 2, "red");
    agregarColorNodo(2, 2, "green");
    agregarColorNodo(3, 1, "gray");
    agregarColorNodo(3, 2, "green");
    return;
  }
};
