import { Reporte } from "../src/Reporte.js";

describe("Parte 1 · Modelo Reporte", () => {
  test("un motivo vacío lanza error", () => {
    expect(() => new Reporte("usuario1", "   ")).toThrow("Motivo inválido");
  });
});