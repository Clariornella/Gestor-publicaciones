export class NotificadorWeb {
  notificar(mensaje) {
    return `Notificación web: ${mensaje}`;
  }
}

export class NotificadorEmail {
  notificar(mensaje) {
    return `Email enviado: ${mensaje}`;
  }
}

export class GestorNotificaciones {
  enviar(notificador, mensaje) {
    return notificador.notificar(mensaje);
  }
}
