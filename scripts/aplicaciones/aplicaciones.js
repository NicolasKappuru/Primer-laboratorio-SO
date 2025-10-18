// =======================
// Aplicaciones (panel izquierdo)
// =======================

// tabla global de aplicaciones
window.aplicaciones = window.aplicaciones || [];

//Aplicaciones por defecto

if (window.aplicaciones.length === 0) {
  window.aplicaciones.push(
    { pid: 1, nombre: "Notepad", estado: false, codigo: 19524, datosIni: 12352, datosNoIni: 1165 },
    { pid: 2, nombre: "Word", estado: false, codigo: 77539, datosIni: 32680, datosNoIni: 4100 },
    { pid: 3, nombre: "Excel", estado: false, codigo: 99542, datosIni: 24245, datosNoIni: 7557 },
    { pid: 4, nombre: "AutoCAD", estado: false, codigo: 115000, datosIni: 123470, datosNoIni: 1123 },
    { pid: 5, nombre: "Calculadora", estado: false, codigo: 12342, datosIni: 1256, datosNoIni: 1756 },
    { pid: 6, nombre: "P1", estado: false, codigo: 525000, datosIni: 3224000, datosNoIni: 51000 },
    { pid: 7, nombre: "P2", estado: false, codigo: 590000, datosIni: 974000, datosNoIni: 25000 },
    { pid: 8, nombre: "P3", estado: false, codigo: 349000, datosIni: 2150000, datosNoIni: 1000 }
    
  );
}