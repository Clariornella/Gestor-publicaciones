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
