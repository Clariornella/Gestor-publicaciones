class PublicacionServicio {
  constructor(titulo, autor, precioHora) {
    this.titulo = titulo;
    this.autor = autor;
    this.precioHora = precioHora;
  }
  calcularCosto(horasContratadas) {
    return this.precioHora * horasContratadas;
  }
  aplicarCupon(cupon) {
    const costo = this.calcularCosto(2);
    return costo - cupon.calcularDescuento(costo);
  }
  notificar(servicioNotificaciones, mensaje) {
    servicioNotificaciones.enviar(this.autor.email, mensaje);
  }
}

// Clases relacionadas con PublicacionServicio:
// AplicarCupon: dependencia. Se recibe como parámetro temporal dentro del método aplicarCupon(cupon). No se guarda en this y la referencia se descarta al finalizar la ejecución del método.
// Notificar: dependencia. Se pasa como argumento exclusivamente al método notificar(...) para ejecutar una acción puntual (enviar). No persiste como parte del estado del objeto PublicacionServicio.

// ¿Cambiaría si servicioNotificaciones se guardara en el constructor como this.notificador? -->
// Cambiaria a Asociacion. Al asignarse en el constructor como atributo de la instancia (this.notificador = servicioNotificaciones), el vínculo deja de ser una interacción temporal/de paso y pasa a formar parte de la estructura y estado permanente del objeto, persistiendo durante todo su ciclo de vida.

// Regla práctica: Si queda guardado en el objeto con this. --> Asociación. Si solo entra como argumento de un método para hacer una tarea y desaparece --> Dependencia.
