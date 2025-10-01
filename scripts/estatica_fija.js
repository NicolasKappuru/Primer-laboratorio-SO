// Parámetros de memoria
const MEM_TOTAL = 16777216; 
const PARTICIONES = 16;
const TAM_PARTICION = MEM_TOTAL / PARTICIONES;

// Pila de particiones libres (índices 0 a 14, porque la 15 es SO)
let libres = [];
for (let i = 0; i < PARTICIONES - 1; i++) {
  libres.push(i);
}

// Estado de particiones
let memoria = Array.from({ length: PARTICIONES }, (_, i) => {
  return {
    index: i,
    hex: "0x" + (i * TAM_PARTICION).toString(16).toUpperCase(),
    dec: i * TAM_PARTICION,
    pid: (i === PARTICIONES - 1) ? "SO" : "Libre",
    size: TAM_PARTICION
  };
});

// Renderiza tabla
function renderTablaEstatica() {
  const contenedor = document.getElementById("tabla-estatica");
  
  let html = `
    <table class="tabla-estatica">
      <thead>
        <tr>
          <th>Hexadecimal</th>
          <th>Decimal</th>
          <th>PID</th>
          <th>Tamaño</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  memoria.forEach(part => {
    html += `
      <tr class="${part.pid === 'SO' ? 'so' : (part.pid === 'Libre' ? 'libre' : 'ocupado')}">
        <td>${part.hex}</td>
        <td>${part.dec}</td>
        <td>${part.pid}</td>
        <td>${part.size}</td>
      </tr>
    `;
  });
  
  html += `</tbody></table>`;
  contenedor.innerHTML = html;
}

// Insertar proceso (ejemplo)
function insertarProceso(pid) {
  if (libres.length === 0) {
    alert("Memoria llena");
    return;
  }
  const pos = libres.shift();
  memoria[pos].pid = pid;
  renderTablaEstatica();
}

// Liberar proceso
function liberarProceso(pid) {
  const pos = memoria.findIndex(p => p.pid === pid);
  if (pos !== -1 && pos !== PARTICIONES - 1) { // no borrar SO
    memoria[pos].pid = "Libre";
    libres.unshift(pos);
    renderTablaEstatica();
  }
}



// Render inicial
document.addEventListener("DOMContentLoaded", renderTablaEstatica);
