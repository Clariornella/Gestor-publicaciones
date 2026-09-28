// =============================================================================
// CANALES DE NOTIFICACIÓN INTERCAMBIABLES (CONTRATO COMPARTIDO)
// -----------------------------------------------------------------------------
// [TP: Día 10 · Clases 13 y 14 de Teoría: Etiquetas en revisión: reportes y notificaciones - Parte 4]
// EXPLICACIÓN:
// Modela canales de notificación polimórficos e independientes entre sí.
// - Ninguna clase conoce a la otra; ambas cumplen el mismo contrato público:
//   implementan el método notificar(mensaje) y retornan una cadena con el envío formateado.
// - Esta interfaz común permite probar ambos canales mediante tablas de datos en Jest
//   usando test.each sin duplicar casos de prueba.
// =============================================================================

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

// =============================================================================
// USO POLIMÓRFICO CON GESTOR DE NOTIFICACIONES (INVERSIÓN / DELEGACIÓN)
// -----------------------------------------------------------------------------
// [TP: Día 10 · Clases 13 y 14 de Teoría - Parte 5: Uso polimórfico con GestorNotificaciones]
// EXPLICACIÓN:
// GestorNotificaciones actúa como coordinador delegando la acción en el colaborador recibido.
// - No conoce el tipo concreto del objeto (no usa instanceof ni evalúa si es Web o Email).
// - Recibe el objeto por parámetro (dependencia/inyección) y ejecuta .notificar(mensaje).
// - Permite agregar a futuro nuevos canales (como NotificadorConsola o NotificadorSMS)
//   sin tener que modificar ni una sola línea de esta clase.
// =============================================================================
export class GestorNotificaciones {
  enviar(notificador, mensaje) {
    return notificador.notificar(mensaje);
  }
}
