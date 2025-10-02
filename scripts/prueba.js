// Importar la clase desde lista.js (si no usas "export" en lista.js, simplemente cópialo todo aquí)
const { ListaEnlazada } = require("./lista.js");

/*
// Crear una lista enlazada vacía
let memoria = new ListaEnlazada();

// Insertar algunos bloques de memoria (como particiones iniciales)
memoria.insertar("Disponible", "0x0000", 0, null, 100);
memoria.insertar("Disponible", "0x0064", 100, null, 200);
memoria.insertar("Disponible", "0x012C", 300, null, 150);

console.log("📌 Estado inicial de la memoria:");
console.log(JSON.stringify(memoria, null, 2));
*/

let memoria2 = new ListaEnlazada();
// Insertar procesos con distintos algoritmos
memoria2.insertar("Disponible", "0x0000", 0, "P3", 100);
memoria2.insertarProcesoFijo("P1", 50, "PrimerOrden");
memoria2.insertarProcesoFijo("P2", 120, "MejorAjuste");

console.log("\n📌 Después de insertar P1 (50) y P2 (120):");
console.log(JSON.stringify(memoria2, null, 2));

// Probar eliminación de un proceso
memoria2.eliminarFijo("P1");
console.log("\n📌 Después de eliminar P1:");
console.log(JSON.stringify(memoria2, null, 2));


let memoria3 = new ListaEnlazada();
// Insertar un proceso dinámico
memoria3.insertar("Disponible", "0x0000", 0, null, 100);
memoria3.insertarProcesoDinamico("P3", 80, "PeorAjuste");
console.log("\n📌 Después de insertar P3 (dinámico, 80):");
console.log(JSON.stringify(memoria3, null, 2));
