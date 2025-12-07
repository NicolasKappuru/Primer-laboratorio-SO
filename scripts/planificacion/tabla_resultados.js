function generarTablaResultados(gridMap) {
    let html = `
        <table class="resultado-table">
            <thead>
                <tr>
                    <th>Proceso</th>
                    <th>Instante llegada</th>
                    <th>Ejecución t</th>
                    <th>Espera</th>
                    <th>Bloqueo</th>
                    <th>Instante fin If</th>
                    <th>Retorno T</th>
                    <th>Tiempo perdido</th>
                    <th>Penalidad Ip</th>
                    <th>Tiempo Respuesta Tr</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Acumuladores para promedios
    const metrics = {
        retornos: [],
        ejecuciones: [],
        esperas: [],
        perdidos: []
    };

    Object.keys(gridMap).forEach(pid => {
        const nodos = gridMap[pid];

        // Ordenar por "time"
        nodos.sort((a, b) => a.time - b.time);

        const ejecucion = nodos.filter(n => n.color === "green").length;
        const espera    = nodos.filter(n => n.color === "gray").length;
        const bloqueo   = nodos.filter(n => n.color === "red").length;

        // Primer y último green
        const greens = nodos.filter(n => n.color === "green");

        const primerGreen = greens[0];
        const ultimoGreen = greens[greens.length - 1];

        const instanteFin = ultimoGreen.time;

        // Primer nodo del proceso
        const primerNodo = nodos[0];

        const instanteLlegada = primerNodo.time -1

        const retorno = instanteFin - instanteLlegada;
        const tiempoPerdido = retorno - ejecucion;
        const penalidad = (retorno / ejecucion).toFixed(2);

        // Primer gray
        const grays = nodos.filter(n => n.color === "gray");
        const primerGray = grays.length ? grays[0] : { time: primerNodo.time };

        let valor = primerGreen.time - primerGray.time;
        
        if (primerGreen.time < primerGray.time) {
            valor = 0;
        }

        const tiempoRespuesta = valor;

        // Guardar valores para promedios
        metrics.retornos.push(retorno);
        metrics.ejecuciones.push(ejecucion);
        metrics.esperas.push(espera);
        metrics.perdidos.push(tiempoPerdido);

        // Agregar fila
        html += `
            <tr>
                <td>${pid}</td>
                <td>${instanteLlegada}</td>
                <td>${ejecucion}</td>
                <td>${espera}</td>
                <td>${bloqueo}</td>
                <td>${instanteFin}</td>
                <td>${retorno}</td>
                <td>${tiempoPerdido}</td>
                <td>${penalidad}</td>
                <td>${tiempoRespuesta}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <br><br>
    `;

    // ----------- SEGUNDA TABLA -----------

    // Tiempo encendido: máximo "time" de toda la matriz
    let allNodes = [];
    Object.values(gridMap).forEach(lista => allNodes.push(...lista));

    const tiempoEncendido = Math.max(...allNodes.map(n => n.time));

    // Uso total CPU: cantidad de nodos verdes
    const usoCPU = allNodes.filter(n => n.color === "green").length;

    // CPU desocupada: tiempo donde NO existe ningún green
    const cpuDesocupada = tiempoEncendido-usoCPU

    // Promedios
    const promRetorno = (metrics.retornos.reduce((a,b)=>a+b,0) / metrics.retornos.length).toFixed(2);
    const promEjec = (metrics.ejecuciones.reduce((a,b)=>a+b,0) / metrics.ejecuciones.length).toFixed(2);
    const promEspera = (metrics.esperas.reduce((a,b)=>a+b,0) / metrics.esperas.length).toFixed(2);
    const promPerdido = (metrics.perdidos.reduce((a,b)=>a+b,0) / metrics.perdidos.length).toFixed(2);

    html += `
        <table class="resultado-table">
            <tbody>
                <tr><td><b>Tiempo encendido</b></td><td>${tiempoEncendido}</td></tr>
                <tr><td><b>Uso total de CPU</b></td><td>${usoCPU}</td></tr>
                <tr><td><b>CPU desocupada</b></td><td>${cpuDesocupada}</td></tr>
                <tr><td><b>Promedio de retorno</b></td><td>${promRetorno}</td></tr>
                <tr><td><b>Promedio de ejecución</b></td><td>${promEjec}</td></tr>
                <tr><td><b>Promedio de espera</b></td><td>${promEspera}</td></tr>
                <tr><td><b>Promedio de tiempo perdido</b></td><td>${promPerdido}</td></tr>
            </tbody>
        </table>
    `;

    mostrarPopup(html);
}

// Mostrar popup 
function mostrarPopup(contenido) { 
    const modal = document.getElementById("popupResultados"); 
    const body = document.getElementById("popupContenido"); 
    body.innerHTML = contenido; modal.style.display = "flex"; 
} 

// Cerrar popup 
function cerrarPopup() { 
    document.getElementById("popupResultados").style.display = "none"; 
}