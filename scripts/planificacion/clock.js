// Crear variable global explícita
window.clock = 0;

// Incrementa el clock global
window.incrementClock = function () {
    window.clock += 1;
    console.log("Clock:", window.clock); // opcional
};

// Función llamada desde el botón
window.selectOption = function (option, event) {
    if (option === "Clock") {
        window.incrementClock();
    }
};
