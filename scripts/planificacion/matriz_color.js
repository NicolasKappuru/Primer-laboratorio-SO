// =======================================================
//      ESTRUCTURA GLOBAL DE COLOR PARA LOS GRIDS
// =======================================================

window.gridColorMap = window.gridColorMap || {};

window.agregarColorNodo = function(time, pid, color) {

    if (!window.gridColorMap[pid]) {
        window.gridColorMap[pid] = [];
    }

    window.gridColorMap[pid].push({
        time: Number(time),
        color: color
    });

    // Opcional: Ver estructura
    console.log("Nodo agregado: ", time, pid, color);
    console.log(window.gridColorMap);
};

window.pintarDesdeEstructura = function() {
    console.log("Pintando estado desde estructura…");

    for (let pid in window.gridColorMap) {

        const listaNodos = window.gridColorMap[pid];

        for (let nodo of listaNodos) {

            const time = nodo.time;
            const color = nodo.color;

            const x = time;  
            const y = Number(pid); 
            paintCell(x, y, color);
        }
    }

    console.log("Pintado terminado.");
};


window.imprimirGridColorMap = function() {
    console.log("=== GRID COLOR MAP (x, y, color) ===");

    for (let pid in window.gridColorMap) {
        const lista = window.gridColorMap[pid];

        for (let nodo of lista) {
            console.log(
                `x=${nodo.time}, y=${pid}, color=${nodo.color}`
            );
        }
    }
};

