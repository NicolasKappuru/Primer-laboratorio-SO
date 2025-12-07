class ColaPrioridad{
    constructor(){
        this.head = null
        this.ultimo = null
    }


    push(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueoActual, tiempoEjecucionActual) {
        const nuevoNodo = new NodoPlanificacion(
            prioridad, pid, tiempoEjecucion, inicioBloqueo,
            duracionBloqueo, duracionBloqueoActual, "await",
            tiempoEjecucionActual
        );

        // CASO 1: Lista vacía
        if (!this.head) {
            this.head = nuevoNodo;
            this.ultimo = nuevoNodo;
            return;
        }

        // CASO 2: Insertar al inicio
        if (prioridad < this.head.prioridad) {
            nuevoNodo.back = this.head;
            this.head.front = nuevoNodo;
            this.head = nuevoNodo;
            return;
        }

        // CASO 2.5: Insertar por llegada

        if(prioridad == this.head.prioridad && pid < this.head.pid){
            nuevoNodo.back = this.head;
            this.head.front = nuevoNodo;
            this.head = nuevoNodo;
            return;
        }

        // CASO 3: Entre la lista
        let actual = this.head.back;

        while (actual) {

            let anterior = actual.front;

            if (prioridad < actual.prioridad) {
                // Insertar antes de "actual"

                nuevoNodo.front = anterior;
                nuevoNodo.back = actual;

                anterior.back = nuevoNodo;
                actual.front = nuevoNodo;
                return;
            }

            if(prioridad == this.head.prioridad && pid < this.head.pid){
                nuevoNodo.front = anterior;
                nuevoNodo.back = actual;

                anterior.back = nuevoNodo;
                actual.front = nuevoNodo;
                return;
            }

            actual = actual.back;
        }

        // CASO 4: Insertar al final
        this.ultimo.back = nuevoNodo;
        nuevoNodo.front = this.ultimo;
        this.ultimo = nuevoNodo;
    }

    pushRR(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueoActual, tiempoEjecucionActual) {
        const nuevoNodo = new NodoPlanificacion(
            prioridad, pid, tiempoEjecucion, inicioBloqueo,
            duracionBloqueo, duracionBloqueoActual, "await",
            tiempoEjecucionActual
        );

        // CASO 1: Lista vacía
        if (!this.head) {
            this.head = nuevoNodo;
            this.ultimo = nuevoNodo;
            return;
        }

        // CASO 2: Insertar al inicio
        if (prioridad < this.head.prioridad) {
            nuevoNodo.back = this.head;
            this.head.front = nuevoNodo;
            this.head = nuevoNodo;
            return;
        }

        // CASO 3: Entre la lista
        let actual = this.head.back;

        while (actual) {

            let anterior = actual.front;

            if (prioridad < actual.prioridad) {
                // Insertar antes de "actual"

                nuevoNodo.front = anterior;
                nuevoNodo.back = actual;

                anterior.back = nuevoNodo;
                actual.front = nuevoNodo;
                return;
            }

            actual = actual.back;
        }

        // CASO 4: Insertar al final
        this.ultimo.back = nuevoNodo;
        nuevoNodo.front = this.ultimo;
        this.ultimo = nuevoNodo;
    }

    pop() {
        if (!this.head) return null; // lista vacía

        let primerNodo = this.head;
        let nuevoHead = primerNodo.back;

        // Actualizar head
        this.head = nuevoHead;

        if (nuevoHead) {
            nuevoHead.front = null;   // ← Limpieza correcta
        } else {
            this.ultimo = null;       // lista quedó vacía
        }

        // Opcional: limpiar punteros del nodo removido
        primerNodo.back = null;
        primerNodo.front = null;

        return {
            prioridad: primerNodo.prioridad,
            pid: primerNodo.pid,
            tiempoEjecucion: primerNodo.tiempoEjecucion,
            inicioBloqueo: primerNodo.inicioBloqueo,
            duracionBloqueo: primerNodo.duracionBloqueo,
            duracionBloqueoActual: primerNodo.duracionBloqueoActual,
            tiempoEjecucionActual: primerNodo.tiempoEjecucionActual
        };
    }



    print() {
    console.log("=== COLA DE PRIORIDAD ===");
    let apuntador = this.head;

    while (apuntador) {
        console.log(
            `P=${apuntador.prioridad}, PID=${apuntador.pid}, ` +
            `TE=${apuntador.tiempoEjecucion}, IB=${apuntador.inicioBloqueo}, ` +
            `DB=${apuntador.duracionBloqueo}, DBA=${apuntador.duracionBloqueoActual}` +
            `E=${apuntador.estado}, TEA = ${apuntador.tiempoEjecucionActual} `
        );
        apuntador = apuntador.back;
    }

    console.log("=========================\n");
    }

    isEmpty(){
        return this.head == null    
    }

    report(clockActual){
        let apuntador = this.head
        while (apuntador){
            agregarColorNodo(clockActual, apuntador.pid, "gray")
            apuntador = apuntador.back
        }
    }

    reportRR(clockActual){
        let apuntador = this.head
        while (apuntador){
            agregarColorNodo(clockActual, apuntador.pid+1, "gray")
            apuntador = apuntador.back
        }
    }

}
