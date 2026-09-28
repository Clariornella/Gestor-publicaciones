// =============================================================================
// SUITE DE PRUEBAS ASÍNCRONAS CON JEST
// -----------------------------------------------------------------------------
// [TP: Día 10 · Clases 13 y 14 de Teoría: Etiquetas en revisión: reportes y notificaciones - Partes 6 y 7]
// EXPLICACIÓN GENERAL:
// Verifica el comportamiento asíncrono del método Publicacion.revisar(servicioModeracion).
// - El método colaborar con un servicio externo (simulado como un doble de prueba o stub).
// - Se comprueban los tres caminos posibles:
//   1. Resolución exitosa ("aprobado") -> actualiza el estado a "aprobada".
//   2. Resolución de rechazo ("rechazado") -> actualiza el estado a "rechazada".
//   3. Falla o caída del servicio (promesa rechazada) -> conserva el estado original "pendiente".
// - Utiliza los matchers asíncronos de Jest: await expect(...).resolves y await expect(...).rejects.
// =============================================================================

import { Publicacion } from "../src/Publicacion.js";

describe("Publicacion.revisar", () => {
  // Constante representativa para cumplir con las reglas de validación del constructor de Publicacion
  const descValida = "Descripción válida con más de veinte caracteres.";

  // ===========================================================================
  // CASO 1: APROBACIÓN POR EL SERVICIO
  // ---------------------------------------------------------------------------
  // [TP: Día 10 · Clases 13 y 14 de Teoría - Parte 7: Pruebas asíncronas]
  // EXPLICACIÓN:
  // Se crea un colaborador stub cuyo método evaluar() resuelve la promesa con "aprobado".
  // Se verifica con .resolves.toBe("aprobada") que la promesa culmine con el valor retornado,
  // y luego se comprueba el efecto secundario sobre la propiedad interna publicacion.estado.
  // ===========================================================================
  test("aprueba la publicación cuando el servicio resuelve aprobado", async () => {
    const servicio = { evaluar: async () => "aprobado" };
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);

    await expect(publicacion.revisar(servicio)).resolves.toBe("aprobada");
    expect(publicacion.estado).toBe("aprobada");
  });

  // ===========================================================================
  // CASO 2: RECHAZO POR EL SERVICIO
  // ---------------------------------------------------------------------------
  // [TP: Día 10 · Clases 13 y 14 de Teoría - Parte 7: Pruebas asíncronas]
  // EXPLICACIÓN:
  // El colaborador stub resuelve la evaluación con "rechazado".
  // Se comprueba que revisar() devuelva "rechazada" y que publicacion.estado
  // mute coherentemente a dicho valor.
  // ===========================================================================
  test("rechaza la publicación cuando el servicio resuelve rechazado", async () => {
    const servicio = { evaluar: async () => "rechazado" };
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);

    await expect(publicacion.revisar(servicio)).resolves.toBe("rechazada");
    expect(publicacion.estado).toBe("rechazada");
  });

  // ===========================================================================
  // CASO 3: MANEJO DE FALLOS Y COHERENCIA DE ESTADO
  // ---------------------------------------------------------------------------
  // [TP: Día 10 · Clases 13 y 14 de Teoría - Parte 7: Pruebas asíncronas]
  // EXPLICACIÓN:
  // Simula un error de red o timeout lanzando una excepción dentro de evaluar().
  // Se usa await expect(...).rejects.toThrow("Servicio no disponible") para
  // confirmar que la excepción se propague correctamente hacia afuera.
  // Es indispensable comprobar adicionalmente expect(publicacion.estado).toBe("pendiente")
  // para asegurar que ante una falla del colaborador externo, la entidad de dominio
  // mantenga la integridad y coherencia de su estado original sin corromperse.
  // ===========================================================================
  test("conserva el estado pendiente si el servicio falla", async () => {
    const servicio = {
      evaluar: async () => {
        throw new Error("Servicio no disponible");
      },
    };
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);

    await expect(publicacion.revisar(servicio)).rejects.toThrow(
      "Servicio no disponible",
    );
    expect(publicacion.estado).toBe("pendiente");
  });
});
