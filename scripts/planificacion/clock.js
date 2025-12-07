window.clockFCFS = 0;
window.clockSJF = 0;
window.clockSRTF = 0;
window.clockRR = 0;

window.incrementClockFor = function (algoritmo) {

  if (algoritmo === "fcfs") {
      window.clockFCFS++;
      addClockColumn(window.clockFCFS);
      
      window.fcfs.processLogic()
      window.fcfs.report()

      pintarDesdeEstructura();

      window.imprimirGridColorMap()
  }

  if (algoritmo === "sjf") {
    window.clockSJF++;
    addClockColumn(window.clockSJF);

    window.sjf.processLogic();
    window.sjf.report();

    pintarDesdeEstructura();
    window.imprimirGridColorMap();
  }

  if (algoritmo === "srtf") {
      window.clockSRTF++;
      addClockColumn(window.clockSRTF);

      window.srtf.processLogic();
      window.srtf.report();

      pintarDesdeEstructura();
      window.imprimirGridColorMap()
  }

  if (algoritmo === "rr") {
      window.clockRR++;
      addClockColumn(window.clockRR);
      pintarDesdeEstructura();
  }
};


window.selectOption = function(option, event) {

    if (option === "ClockFCFS") {
        window.incrementClockFor("fcfs");
    }

    if (option === "ClockSJF") {
        window.incrementClockFor("sjf");
    }

    if (option === "ClockSRTF") {
        window.incrementClockFor("srtf");
    }

    if (option === "ClockRR") {
        window.incrementClockFor("rr");
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
