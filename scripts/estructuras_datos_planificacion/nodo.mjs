export default class Nodo{
    constructor(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueoActual) {
        this.prioridad = prioridad
        this.pid = pid
        this.tiempoEjecucion = tiempoEjecucion
        this.inicioBloqueo = inicioBloqueo
        this.duracionBloqueo = duracionBloqueo
        this.duracionBloqueoActual = duracionBloqueoActual

        this.front = null
        this.back = null;
    }
}