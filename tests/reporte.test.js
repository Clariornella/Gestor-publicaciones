// =============================================================================
// SUITE DE PRUEBAS UNITARIAS: MODELO REPORTE
// -----------------------------------------------------------------------------
// [TP: Día 10 · Clases 13 y 14 de Teoría: Etiquetas en revisión: reportes y notificaciones - Parte 1]
// EXPLICACIÓN:
// Verifica la regla de validación inicial del constructor de la clase Reporte:
// - Comprueba que un motivo compuesto únicamente por espacios en blanco ("   ") sea
//   detectado tras aplicar .trim() y lance exactamente Error("Motivo inválido").
// - Se utiliza el matcher de Jest .toThrow("Motivo inválido") pasando la instanciación
//   dentro de una función flecha () => new Reporte(...) para interceptar la excepción
//   sin interrumpir la ejecución de la suite.
// =============================================================================

import { Reporte } from "../src/Reporte.js";

describe("Parte 1 · Modelo Reporte", () => {
  test("un motivo vacío lanza error", () => {
    expect(() => new Reporte("usuario1", "   ")).toThrow("Motivo inválido");
  });
});
