// =============================================================================
// SUITE DE PRUEBAS: CONTRATOS POLIMÓRFICOS CON TEST.EACH
// -----------------------------------------------------------------------------
// [TP: Día 10 · Clases 13 y 14 de Teoría: Etiquetas en revisión: reportes y notificaciones - Partes 4 y 5]
// EXPLICACIÓN GENERAL:
// Verifica el cumplimiento del contrato compartido de los canales de notificación.
// - NotificadorWeb y NotificadorEmail implementan la misma firma de método: notificar(mensaje).
// - GestorNotificaciones actúa como coordinador desacoplado: recibe cualquier notificador
//   por parámetro e invoca .notificar(mensaje) sin comprobar su tipo concreto ni usar instanceof.
// - test.each permite ejecutar la misma aserción sobre una tabla de datos parametrizada,
//   comprobando que cada canal formatee el mensaje según su propia regla sin duplicar código de test.
// =============================================================================

import {
  GestorNotificaciones,
  NotificadorWeb,
  NotificadorEmail,
} from "../src/Notificaciones.js";

test.each([
  [new NotificadorWeb(), "Notificación web: Tu publicación fue aprobada"],
  [new NotificadorEmail(), "Email enviado: Tu publicación fue aprobada"],
])("cada canal notifica según su propio formato", (notificador, esperado) => {
  const gestor = new GestorNotificaciones();
  expect(gestor.enviar(notificador, "Tu publicación fue aprobada")).toBe(
    esperado,
  );
});
