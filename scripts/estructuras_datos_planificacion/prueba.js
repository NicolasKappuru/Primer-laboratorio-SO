import readline from "readline"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let cola_prioridad = new ColaPrioridad()
let lista_bloqueo = new ListaBloqueo()
let nodo_exec = null

let listaProcesos = [[1, "a", 6, 3, 2, 2],
                     [2, "b", 8, 1, 3, 3], 
                     [3, "c", 7, 5, 1, 1], 
                     [4, "d", 3, 0, 0, 0], 
                     [5, "e", 9, 2, 4, 4], 
                     [6, "f", 2, 0, 0, 0]]

let eleccion = 0
let eleccionProceso = 0

let iteracionClock = 0

do{
    
    opciones()
    eleccion = await preguntar();

    switch (eleccion) {
        case 1:
            opcionesProcesos()
            eleccionProceso = await preguntar()

            let proceso = listaProcesos[eleccionProceso-1]

            if(nodo_exec == null){
                nodo_exec = proceso
            } else{
                cola_prioridad.push(proceso[0], proceso[1], proceso[2], proceso[3], proceso[4], proceso[5])
            }

            break;
        case 2:
            console.log("→ Ejecutando clock...");
            iteracionClock += 1

            clock()
            break;
        case 3:
            cola_prioridad.print()
            lista_bloqueo.print()
            console.log("=== Nodo en Ejecucion ===");
            console.log(nodo_exec)
            console.log("=========================\n");
            break;
        case 0:
            console.log("Saliendo...");
            break;
        default:
            console.log("Opción inválida");
    }

}while(eleccion != 0)
rl.close();

function opciones(){
    console.log(
        "1. Iniciar proceso\n"+
        "2. Clock\n"+
        "3. Print\n"+
        "0. Salir\n"
    )
}

function opcionesProcesos(){
    console.log(
        "1. A\n"+
        "2. B\n"+
        "3. C\n"+
        "4. D\n"+
        "5. E\n"+
        "6. F\n"
    )
}

function preguntar() {
    return new Promise((resolve) => {
        rl.question("Ingrese opción: ", (op) => resolve(Number(op)));
    });
}



// cola_prioridad.push(1, 1, 3, 2, 2, 2)
// cola_prioridad.push(2, 2, 5, 2, 1, 1)
// cola_prioridad.push(3, 3, 2, 1, 1, 1)

// cola_prioridad.print()


// let datos = cola_prioridad.pop()

// console.log("Primeros Datos: ", datos)

// lista_bloqueo.add(datos.prioridad, datos.pid, datos.tiempoEjecucion, datos.inicioBloqueo, datos.duracionBloqueo)

// datos = cola_prioridad.pop()

// console.log("Segundos Datos: ", datos)

// lista_bloqueo.add(datos.prioridad, datos.pid, datos.tiempoEjecucion, datos.inicioBloqueo, datos.duracionBloqueo)

// lista_bloqueo.print()

// lista_bloqueo.clock(cola_prioridad)

// console.log("Clock 1:")
// cola_prioridad.print()
// lista_bloqueo.print()

// lista_bloqueo.clock(cola_prioridad)

// console.log("Clock 2:")
// cola_prioridad.print()
// lista_bloqueo.print()


