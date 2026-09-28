import { Publicacion, CATEGORIAS_PERMITIDAS } from "../src/Publicacion.js";
import { PublicacionVenta } from "../src/PublicacionVenta.js";
import { PublicacionServicio } from "../src/PublicacionServicio.js";

describe("Publicacion", () => {
  const descValida = "Descripción válida con más de veinte caracteres.";

  test("una publicación nueva comienza activa y sin etiquetas", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    expect(publicacion.activa).toBe(true);
    expect(publicacion.etiquetas).toEqual([]);
  });

  test("agregarEtiqueta incorpora una etiqueta normalizada", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    publicacion.agregarEtiqueta(" redes ");
    expect(publicacion.etiquetas).toEqual(["redes"]);
  });

  test("darDeBaja cambia activa a false", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    publicacion.darDeBaja();
    expect(publicacion.activa).toBe(false);
  });

  test("una etiqueta repetida no se agrega dos veces", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    publicacion.agregarEtiqueta("redes");
    publicacion.agregarEtiqueta("redes");
    expect(publicacion.etiquetas).toEqual(["redes"]);
  });

  test("una etiqueta vacía lanza el error esperado", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    expect(() => publicacion.agregarEtiqueta(" ")).toThrow("Etiqueta inválida");
  });

  test("tieneEtiqueta ignora mayúsculas y minúsculas", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    publicacion.agregarEtiqueta("Redes");
    expect(publicacion.tieneEtiqueta("redes")).toBe(true);
  });

  test("cada subclase arma su propio resumen", () => {
    const venta = new PublicacionVenta("Calculadora", descValida, "Ana", 5000);
    const servicio = new PublicacionServicio(
      "Clases de Álgebra",
      "Apoyo escolar para universitarios",
      "Luis",
      "Virtual",
      60,
    );

    expect(venta.mostrarResumen()).toContain("$5000");
    expect(servicio.mostrarResumen()).toContain("Clases de Álgebra");
  });
});

describe("Parte 2 · Publicaciones reportables", () => {
  const descValida = "Descripción de prueba con más de veinte caracteres.";

  test("requiereRevision pasa a true con 3 reportes de usuarios distintos", () => {
    const publicacion = new Publicacion("Juan", "Título", descValida);

    publicacion.reportar("user1", "Spam");
    publicacion.reportar("user2", "Contenido inapropiado");
    expect(publicacion.requiereRevision()).toBe(false);

    publicacion.reportar("user3", "Lenguaje ofensivo");
    expect(publicacion.requiereRevision()).toBe(true);
  });

  test("lanza un error si el mismo usuario intenta reportar dos veces", () => {
    const publicacion = new Publicacion("Juan", "Título", descValida);

    publicacion.reportar("user1", "Primer reporte");

    expect(() => {
      publicacion.reportar("user1", "Segundo reporte");
    }).toThrow("El usuario ya reportó esta publicación");
  });

  test.each([
    ["1234", "corto"],
    ["a".repeat(81), "largo"],
  ])("un título %s (%s) lanza el error esperado", (titulo) => {
    expect(
      () =>
        new Publicacion(
          "Ana",
          titulo,
          "Contenido válido de más de veinte caracteres.",
        ),
    ).toThrow("El título debe tener entre 5 y 80 caracteres");
  });

  test("lanza error si el autor está vacío o solo contiene espacios", () => {
    expect(
      () =>
        new Publicacion(
          "",
          "Título válido",
          "Contenido válido de más de veinte caracteres.",
        ),
    ).toThrow("El autor es obligatorio");
    expect(
      () =>
        new Publicacion(
          "   ",
          "Título válido",
          "Contenido válido de más de veinte caracteres.",
        ),
    ).toThrow("El autor es obligatorio");
  });

  test.each([
    ["a".repeat(19), "corta"],
    ["a".repeat(501), "larga"],
  ])("una descripción %s (%s) lanza el error esperado", (desc) => {
    expect(() => new Publicacion("Ana", "Título válido", desc)).toThrow(
      "La descripcion debe tener entre 20 y 500 caracteres",
    );
  });

  test("normaliza espacios en blanco con trim en autor, título y descripción", () => {
    const pub = new Publicacion(
      "   Ana   ",
      "   Título válido   ",
      "   Contenido válido de más de veinte caracteres.   ",
    );
    expect(pub.autor).toBe("Ana");
    expect(pub.titulo).toBe("Título válido");
    expect(pub.descripcion).toBe(
      "Contenido válido de más de veinte caracteres.",
    );
  });
});
