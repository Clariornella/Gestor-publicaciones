import { Publicacion } from "../src/Publicacion.js";
import { PublicacionVenta } from "../src/PublicacionVenta.js";
import { PublicacionServicio } from "../src/PublicacionServicio.js";


describe("Publicacion", () => {
  test("una publicación nueva comienza activa y sin etiquetas", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    expect(publicacion.activa).toBe(true);
    expect(publicacion.etiquetas).toEqual([]);
  });
  test("agregarEtiqueta incorpora una etiqueta normalizada", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.agregarEtiqueta(" redes ");
    expect(publicacion.etiquetas).toEqual(["redes"]);
  });
  test("darDeBaja cambia activa a false", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.darDeBaja();
    expect(publicacion.activa).toBe(false);
  });
  test("una etiqueta repetida no se agrega dos veces", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.agregarEtiqueta("redes");
    publicacion.agregarEtiqueta("redes");
    expect(publicacion.etiquetas).toEqual(["redes"]);
  });
  test("una etiqueta vacía lanza el error esperado", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    expect(() => publicacion.agregarEtiqueta(" ")).toThrow("Etiqueta inválida");
  });
  test("tieneEtiqueta ignora mayúsculas y minúsculas", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.agregarEtiqueta("Redes");
    expect(publicacion.tieneEtiqueta("redes")).toBe(true);
  });
  test("cada subclase arma su propio resumen", () => {
    // Arrange
    const venta = new PublicacionVenta("Ana", "Calculadora", "...", 5000);
    // Orden: titulo, descripcion, autor, modalidad, duracionMinutos, cliente
    const servicio = new PublicacionServicio(
      "Clases de Álgebra",
      "Apoyo escolar",
      "Luis",
      "Virtual",
      60,
    );

    // Act + Assert
    expect(venta.mostrarResumen()).toContain("$5000");
    expect(servicio.mostrarResumen()).toContain("Clases de Álgebra");
  });
});

describe("Parte 2 · Publicaciones reportables", () => {
  test("requiereRevision pasa a true con 3 reportes de usuarios distintos", () => {
    const publicacion = new Publicacion("Juan", "Título", "Contenido");

    publicacion.reportar("user1", "Spam");
    publicacion.reportar("user2", "Contenido inapropiado");
    expect(publicacion.requiereRevision()).toBe(false);

    publicacion.reportar("user3", "Lenguaje ofensivo");
    expect(publicacion.requiereRevision()).toBe(true);
  });

  test("lanza un error si el mismo usuario intenta reportar dos veces", () => {
    const publicacion = new Publicacion("Juan", "Título", "Contenido");

    publicacion.reportar("user1", "Primer reporte");

    expect(() => {
      publicacion.reportar("user1", "Segundo reporte");
    }).toThrow("El usuario ya reportó esta publicación");
  });
});