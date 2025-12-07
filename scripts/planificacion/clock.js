window.clockFCFS = -1;
window.clockSJF = -1;
window.clockSRTF = -1;
window.clockRR = -1;

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

      window.rr.processLogic();
      window.rr.report();

      pintarDesdeEstructura();
      window.imprimirGridColorMap()
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

    if (option === "Resultados") {
        generarTablaResultados(window.gridColorMap);
    }
};
