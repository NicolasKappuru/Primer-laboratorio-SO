export default class Nodo{
    constructor(prioridad, pid, tiempoEjecucion, inicioBloqueo, duracionBloqueo, duracionBloqueoActual, estado) {
        this.prioridad = prioridad
        this.pid = pid
        this.tiempoEjecucion = tiempoEjecucion
        this.inicioBloqueo = inicioBloqueo
        this.duracionBloqueo = duracionBloqueo
        this.duracionBloqueoActual = duracionBloqueoActual

        this.estado = estado

        this.front = null
        this.back = null;
    }
}