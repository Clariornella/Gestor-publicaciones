// =============================================================================
// SUITE DE PRUEBAS UNITARIAS: PUBLICACION Y SUBCLASES
// -----------------------------------------------------------------------------
// [TP: Semana 4 · Día 12: Etiquetas y testing unitario en el gestor de publicaciones]
// Verifica el estado inicial de una publicación, el ciclo de vida de las etiquetas,
// las transiciones de estado y la sobreescritura polimórfica de mostrarResumen().
// =============================================================================

import { Publicacion, CATEGORIAS_PERMITIDAS } from "../src/Publicacion.js";
import { PublicacionVenta } from "../src/PublicacionVenta.js";
import { PublicacionServicio } from "../src/PublicacionServicio.js";

describe("Publicacion", () => {
  const descValida = "Descripción válida con más de veinte caracteres.";

  // ===========================================================================
  // ESTADO INICIAL
  // ---------------------------------------------------------------------------
  // [TP: Semana 4 · Día 12 - Parte 4: Estado y comportamiento]
  // EXPLICACIÓN:
  // Comprueba que toda nueva instancia de Publicacion inicie con su bandera
  // 'activa' en true y su colección de etiquetas vacía ([]).
  // ===========================================================================
  test("una publicación nueva comienza activa y sin etiquetas", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    expect(publicacion.activa).toBe(true);
    expect(publicacion.etiquetas).toEqual([]);
  });

  // ===========================================================================
  // NORMALIZACIÓN DE ETIQUETAS
  // ---------------------------------------------------------------------------
  // [TP: Semana 4 · Día 12 - Parte 4: Estado y comportamiento]
  // EXPLICACIÓN:
  // Verifica que agregarEtiqueta() aplique .trim() eliminando espacios sobrantes
  // antes de incorporar el elemento al arreglo interno.
  // ===========================================================================
  test("agregarEtiqueta incorpora una etiqueta normalizada", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    publicacion.agregarEtiqueta(" redes ");
    expect(publicacion.etiquetas).toEqual(["redes"]);
  });

  // ===========================================================================
  // TRANSICIÓN DE ESTADO (DAR DE BAJA)
  // ---------------------------------------------------------------------------
  // [TP: Semana 4 · Día 12 - Parte 4: Estado y comportamiento]
  // EXPLICACIÓN:
  // Comprueba que el método darDeBaja() modifique correctamente la propiedad activa
  // a false, reflejando el cambio de estado sin destruir la instancia.
  // ===========================================================================
  test("darDeBaja cambia activa a false", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    publicacion.darDeBaja();
    expect(publicacion.activa).toBe(false);
  });

  // ===========================================================================
  // CONTROL DE DUPLICADOS EN ETIQUETAS
  // ---------------------------------------------------------------------------
  // [TP: Semana 4 · Día 12 - Parte 5: Reglas de etiquetas]
  // EXPLICACIÓN:
  // Verifica que intentar insertar la misma etiqueta más de una vez no duplique
  // elementos dentro del arreglo this.etiquetas.
  // ===========================================================================
  test("una etiqueta repetida no se agrega dos veces", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    publicacion.agregarEtiqueta("redes");
    publicacion.agregarEtiqueta("redes");
    expect(publicacion.etiquetas).toEqual(["redes"]);
  });

  // ===========================================================================
  // VALIDACIÓN DE ETIQUETA VACÍA
  // ---------------------------------------------------------------------------
  // [TP: Semana 4 · Día 12 - Parte 5: Reglas de etiquetas]
  // EXPLICACIÓN:
  // Verifica que enviar una cadena vacía o compuesta únicamente por espacios lance
  // el error esperado mediante el matcher .toThrow("Etiqueta inválida").
  // ===========================================================================
  test("una etiqueta vacía lanza el error esperado", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    expect(() => publicacion.agregarEtiqueta(" ")).toThrow("Etiqueta inválida");
  });

  // ===========================================================================
  // BÚSQUEDA INSENSIBLE A MAYÚSCULAS/MINÚSCULAS
  // ---------------------------------------------------------------------------
  // [TP: Semana 4 · Día 12 - Parte 5: Reglas de etiquetas]
  // EXPLICACIÓN:
  // Comprueba que tieneEtiqueta() compare normalizando a minúsculas,
  // devolviendo true independientemente del formato de entrada.
  // ===========================================================================
  test("tieneEtiqueta ignora mayúsculas y minúsculas", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", descValida);
    publicacion.agregarEtiqueta("Redes");
    expect(publicacion.tieneEtiqueta("redes")).toBe(true);
  });

  // ===========================================================================
  // REGRESIÓN POLIMÓRFICA EN SUBCLASES
  // ---------------------------------------------------------------------------
  // [TP: Semana 4 · Día 12 - Parte 7: Regresión del sistema existente]
  // [TP: Día 4 · Práctica: Polimorfismo: cada Publicacion responde a su manera]
  // EXPLICACIÓN:
  // Comprueba el polimorfismo por resultado sin usar instanceof: cada subclase
  // sobreescribe mostrarResumen() incorporando sus atributos específicos
  // ($precio en venta y duración/modalidad en servicio).
  // ===========================================================================
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

// =============================================================================
// SUITE: REPORTES, VALIDACIÓN Y NORMALIZACIÓN DE DOMINIO
// -----------------------------------------------------------------------------
// [TP: Día 10 · Clases 13 y 14 de Teoría: Etiquetas en revisión: reportes y notificaciones - Parte 2]
// [TP: Día 16 · Clase 16 de Teoría: Alta de publicaciones con validación en el servidor - Partes 1 y 6]
// Verifica el umbral de moderación (3 reportes), la prevención de votos dobles y las
// validaciones de negocio en el constructor (convertir -> validar -> asignar).
// =============================================================================
describe("Parte 2 · Publicaciones reportables", () => {
  const descValida = "Descripción de prueba con más de veinte caracteres.";

  // ===========================================================================
  // UMBRAL DE MODERACIÓN
  // ---------------------------------------------------------------------------
  // [TP: Día 10 · Clases 13 y 14 de Teoría - Parte 2: Publicaciones reportables]
  // EXPLICACIÓN:
  // Verifica que requiereRevision() retorne false con menos de 3 reportes y pase
  // a true exactamente al acumular 3 reportes de usuarios distintos.
  // ===========================================================================
  test("requiereRevision pasa a true con 3 reportes de usuarios distintos", () => {
    const publicacion = new Publicacion("Juan", "Título", descValida);

    publicacion.reportar("user1", "Spam");
    publicacion.reportar("user2", "Contenido inapropiado");
    expect(publicacion.requiereRevision()).toBe(false);

    publicacion.reportar("user3", "Lenguaje ofensivo");
    expect(publicacion.requiereRevision()).toBe(true);
  });

  // ===========================================================================
  // REPORTE DUPLICADO POR EL MISMO USUARIO
  // ---------------------------------------------------------------------------
  // [TP: Día 10 · Clases 13 y 14 de Teoría - Parte 2: Publicaciones reportables]
  // EXPLICACIÓN:
  // Verifica la regla de unicidad por usuario: si un mismo identificador intenta
  // reportar por segunda vez, se interrumpe lanzando el error de negocio correspondiente.
  // ===========================================================================
  test("lanza un error si el mismo usuario intenta reportar dos veces", () => {
    const publicacion = new Publicacion("Juan", "Título", descValida);

    publicacion.reportar("user1", "Primer reporte");

    expect(() => {
      publicacion.reportar("user1", "Segundo reporte");
    }).toThrow("El usuario ya reportó esta publicación");
  });

  // ===========================================================================
  // LÍMITES EXACTOS DEL TÍTULO (TEST.EACH)
  // ---------------------------------------------------------------------------
  // [TP: Día 16 · Clase 16 de Teoría - Parte 6: Pruebas Jest para límites y normalización]
  // EXPLICACIÓN:
  // Evalúa valores límite por fuera del contrato (4 caracteres por defecto,
  // 81 caracteres por exceso) asegurando que el constructor rechace ambos casos.
  // ===========================================================================
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

  // ===========================================================================
  // REGLA DE AUTOR OBLIGATORIO
  // ---------------------------------------------------------------------------
  // [TP: Día 16 · Clase 16 de Teoría - Partes 1 y 6]
  // EXPLICACIÓN:
  // Comprueba que no se admita un autor vacío ni cadenas formadas únicamente por
  // espacios en blanco, lanzando "El autor es obligatorio".
  // ===========================================================================
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

  // ===========================================================================
  // LÍMITES EXACTOS DE LA DESCRIPCIÓN (TEST.EACH)
  // ---------------------------------------------------------------------------
  // [TP: Día 16 · Clase 16 de Teoría - Parte 6]
  // EXPLICACIÓN:
  // Verifica el rango estricto del contenido (entre 20 y 500 caracteres),
  // comprobando que falle ante 19 caracteres (corta) o 501 caracteres (larga).
  // ===========================================================================
  test.each([
    ["a".repeat(19), "corta"],
    ["a".repeat(501), "larga"],
  ])("una descripción %s (%s) lanza el error esperado", (desc) => {
    expect(() => new Publicacion("Ana", "Título válido", desc)).toThrow(
      "La descripcion debe tener entre 20 y 500 caracteres",
    );
  });

  // ===========================================================================
  // NORMALIZACIÓN DE ESPACIOS (.TRIM())
  // ---------------------------------------------------------------------------
  // [TP: Día 16 · Clase 16 de Teoría - Partes 1 y 6]
  // EXPLICACIÓN:
  // Comprueba el ciclo de conversión antes de asignar: valida que los espacios
  // accidentales al inicio y al final sean limpiados en autor, título y descripción.
  // ===========================================================================
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
