class RR {
    constructor() {
        this.await_queue = new ColaPrioridad(); 
        this.nodo_exec = null;
        this.blocked = new ListaBloqueo();

        this.ciclo = 0;

        this.quantums = 0;
    }

    startProcess(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo) {
        this.await_queue.push(
            prioridad, pid,
            tiempoEjecucion, inicioBloqueo,
            duracionBloqueo, duracionBloqueo,
            0
        );
    }

    processLogic() {

        this.blocked.clock(this.await_queue);

        if (this.nodo_exec) {

            if(this.nodo_exec.pid != "Dispatcher"){
                this.ciclo++
            }

            if (this.nodo_exec.tiempoEjecucionActual == this.nodo_exec.inicioBloqueo) { //Si se debe bloquear
                this.blocked.add(
                    window.clockRR, this.nodo_exec.pid,
                    this.nodo_exec.tiempoEjecucion, this.nodo_exec.inicioBloqueo,
                    this.nodo_exec.duracionBloqueo, this.nodo_exec.tiempoEjecucionActual
                );
                
                if(this.await_queue){
                    window.rr.startProcess(-1, "Dispatcher", 1, -1, 0)
                    this.ciclo = 0
                }

                this.insertFromQueue();

            } else if (this.nodo_exec.tiempoEjecucionActual == this.nodo_exec.tiempoEjecucion){ //Si cumplio su tiempo de ejecucion
                if(this.nodo_exec.pid == "Dispatcher"){
                    this.insertFromQueue();
                }else{
                    window.rr.startProcess(-1, "Dispatcher", 1, -1, 0)
                    this.ciclo = 0
                    this.insertFromQueue();    
                }
                
                
            } else if (this.ciclo == this.quantums){
                if(this.nodo_exec.pid != "Dispatcher"){
                    this.await_queue.push(
                        clockRR, this.nodo_exec.pid,
                        this.nodo_exec.tiempoEjecucion, this.nodo_exec.inicioBloqueo,
                        this.nodo_exec.duracionBloqueo, this.nodo_exec.duracionBloqueo,
                        this.nodo_exec.tiempoEjecucionActual
                    ); 
                }
                if(this.await_queue){
                    window.rr.startProcess(-1, "Dispatcher", 1, -1, 0)
                    this.ciclo = 0
                }
                
                this.insertFromQueue();
            }

        } else {
            if(this.await_queue){
                if(window.clockRR != 1){
                    window.rr.startProcess(-1, "Dispatcher", 1, -1, 0)
                    this.ciclo = 0
                }
                this.insertFromQueue();
            }else{
                this.insertFromQueue();
            }
        }

        if (this.nodo_exec) {
            this.nodo_exec.tiempoEjecucionActual += 1;
        }

        console.log("Clock RR: ", window.clockRR);
        this.await_queue.print();
        this.blocked.print();
        console.log("=== Nodo en Ejecucion ===");
        console.log(this.nodo_exec);
        console.log("=========================\n");
    }

    insertFromQueue() {
        if (!this.await_queue.isEmpty()) {
            let data = this.await_queue.pop();
            this.nodo_exec = new NodoPlanificacion(
                data.prioridad, data.pid,
                data.tiempoEjecucion, data.inicioBloqueo,
                data.duracionBloqueo, data.duracionBloqueoActual,
                "exec", data.tiempoEjecucionActual
            );
        } else {
            this.nodo_exec = null;
        }
    }

    report() {

        if (!this.blocked.isEmpty()) {
            this.blocked.reportRR(window.clockRR);
        }

        if (!this.await_queue.isEmpty()) {
            this.await_queue.reportRR(window.clockRR);
        }

        if (this.nodo_exec) {
            if(this.nodo_exec.pid == "Dispatcher"){
                agregarColorNodo(window.clockRR, 1, "blue");    
            }else{
                agregarColorNodo(window.clockRR, this.nodo_exec.pid+1, "green");
            }
        }
    }

    setQuantums(quantums){
        this.quantums = quantums
    }
}


const rr = new RR();
window.rr = rr;


function sendQuantums() {
    // Obtener valor del input
    const numero = document.getElementById("quantums").value;
    window.rr.setQuantums(numero)

    window.registrarProcesoVertical("Dispatcher");
    window.rr.startProcess(-1, "Dispatcher", 1, -1, 0)
}