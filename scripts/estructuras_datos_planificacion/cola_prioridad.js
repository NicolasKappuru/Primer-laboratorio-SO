class ColaPrioridad{
    constructor(){
        this.head = null
        this.ultimo = null
    }


    push(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueoActual){
        const nuevoNodo = new NodoPlanificacion(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueoActual, "await")
        if (!this.head){
            this.head = nuevoNodo
            this.ultimo = nuevoNodo
        } else{
            let apuntador = this.head
            while(apuntador){
                if(prioridad<apuntador.prioridad){  //Si se debe meter antes del final

                    if(apuntador.front == null){    //Si se vuelve el primero de la cola
                        this.head = nuevoNodo   
                    }
                    nuevoNodo.front = apuntador.front
                    if(apuntador.front) apuntador.front.back = nuevoNodo
                    apuntador.front = nuevoNodo
                    nuevoNodo.back = apuntador                    
                    return
                }
                apuntador = apuntador.back
            }
            //Si no entro al if, es porque va al final de la cola
            this.ultimo.back = nuevoNodo
            nuevoNodo.front = this.ultimo
            this.ultimo = nuevoNodo
        }
    }

    pop(){
        let primerNodo = this.head
        this.head = this.head.back
        this.head.front = null
        return {
                prioridad: primerNodo.prioridad,
                pid: primerNodo.pid,
                tiempoEjecucion: primerNodo.tiempoEjecucion,
                inicioBloqueo: primerNodo.inicioBloqueo,
                duracionBloqueo: primerNodo.duracionBloqueo,
                estado: primerNodo.estado
               }
    }


    print() {
    console.log("=== COLA DE PRIORIDAD ===");
    let apuntador = this.head;

    while (apuntador) {
        console.log(
            `P=${apuntador.prioridad}, PID=${apuntador.pid}, ` +
            `TE=${apuntador.tiempoEjecucion}, IB=${apuntador.inicioBloqueo}, ` +
            `DB=${apuntador.duracionBloqueo}, DBA=${apuntador.duracionBloqueoActual}` +
            `E=${apuntador.estado} `
        );
        apuntador = apuntador.back;
    }

    console.log("=========================\n");
    }

    isEmpty(){
        return this.head == null    
    }

}
