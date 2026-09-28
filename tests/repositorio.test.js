// =============================================================================
// SUITE DE PRUEBAS UNITARIAS: OPERACIONES CRUD EN EL REPOSITORIO
// -----------------------------------------------------------------------------
// [TP: Día 14 · Clase Teórica 17: Repositorios y operaciones CRUD - Parte 6]
// EXPLICACIÓN GENERAL:
// Verifica las cuatro operaciones fundamentales (Create, Read, Update, Delete)
// sobre RepositorioPublicaciones sin levantar un servidor Express.
// - beforeEach inicializa una nueva instancia antes de cada test para garantizar
//   aislamiento e independencia de ejecución.
// =============================================================================

import { RepositorioPublicaciones } from "../src/RepositorioPublicaciones.js";

describe("RepositorioPublicaciones · CRUD", () => {
  let repositorio;

  beforeEach(() => {
    repositorio = new RepositorioPublicaciones();
  });

  // ===========================================================================
  // PASO 6A: ASIGNACIÓN DE IDENTIDAD INCREMENTAL (CREATE)
  // ---------------------------------------------------------------------------
  // [TP: Día 14 · Clase Teórica 17 - Partes 1 y 2]
  // EXPLICACIÓN:
  // Comprueba que la responsabilidad de calcular y asignar el 'id' recaiga en
  // el repositorio y no en el llamador ni en el constructor de Publicacion.
  // Cada llamada consecutiva a agregar() debe avanzar el contador correlativo
  // comenzando desde 1 (pub1.id === 1, pub2.id === 2).
  // ===========================================================================
  test("agregar asigna ids crecientes a partir de 1", async () => {
    const pub1 = await repositorio.agregar(
      "Clara",
      "Primer Libro",
      "Descripcion con mas de veinte caracteres para validar.",
      "general",
    );
    const pub2 = await repositorio.agregar(
      "Martin",
      "Segundo Libro",
      "Otra descripcion con mas de veinte caracteres valida.",
      "general",
    );

    expect(pub1.id).toBe(1);
    expect(pub2.id).toBe(2);
  });

  // ===========================================================================
  // PASO 6B: ENCAPSULAMIENTO DE LA COLECCIÓN (READ)
  // ---------------------------------------------------------------------------
  // [TP: Día 14 · Clase Teórica 17 - Parte 2]
  // EXPLICACIÓN:
  // Verifica que listar() devuelva una copia superficial ([...this.publicaciones])
  // y nunca la referencia directa al arreglo interno.
  // Al aplicar una mutación destructiva sobre la copia devuelta (copia.pop()),
  // el arreglo original dentro del repositorio debe conservar intactos sus elementos.
  // ===========================================================================
  test("listar devuelve una copia: modificarla no afecta al repositorio", async () => {
    await repositorio.agregar(
      "Clara",
      "Titulo de prueba",
      "Descripcion con mas de veinte caracteres para validar.",
      "general",
    );

    const copia = repositorio.listar();
    copia.pop(); // Modificamos el arreglo devuelto

    expect(copia).toHaveLength(0);
    expect(repositorio.listar()).toHaveLength(1);
  });

  // ===========================================================================
  // PASO 6C: INTEGRIDAD FRENTE A DATOS INVÁLIDOS (UPDATE)
  // ---------------------------------------------------------------------------
  // [TP: Día 14 · Clase Teórica 17 - Parte 3]
  // EXPLICACIÓN:
  // Comprueba que actualizar() reconstruya el objeto a través del constructor de
  // Publicacion para revalidar las reglas del negocio (longitud mínima, campos obligatorios).
  // Si los datos enviados son erróneos (como una descripción menor a 20 caracteres),
  // la promesa debe ser rechazada (.rejects.toThrow()) y el registro almacenado
  // en el repositorio debe permanecer intacto sin corromper el estado de la colección.
  // ===========================================================================
  test("actualizar con datos inválidos no modifica la colección", async () => {
    const original = await repositorio.agregar(
      "Clara",
      "Titulo Original",
      "Descripcion valida original de mas de veinte caracteres.",
      "general",
    );

    // Intentamos actualizar con una descripción menor a 20 caracteres (rompe la validación)
    await expect(
      repositorio.actualizar(original.id, {
        descripcion: "Corta",
      }),
    ).rejects.toThrow();

    // Verificamos que la publicación original siga intacta
    const guardada = repositorio.buscarPorId(original.id);
    expect(guardada.descripcion).toBe(
      "Descripcion valida original de mas de veinte caracteres.",
    );
    expect(guardada.titulo).toBe("Titulo Original");
  });

  // ===========================================================================
  // PASO 6D: RESULTADO EXPLÍCITO ANTE REGISTRO INEXISTENTE (DELETE)
  // ---------------------------------------------------------------------------
  // [TP: Día 14 · Clase Teórica 17 - Parte 4]
  // EXPLICACIÓN:
  // Comprueba que la operación eliminar() devuelva un valor booleano explícito.
  // Si se le pasa un identificador que no existe en el repositorio (ej. 999),
  // no debe fallar ni arrojar error no controlado, sino retornar false.
  // ===========================================================================
  test("eliminar una publicación inexistente devuelve false", async () => {
    const resultado = await repositorio.eliminar(999);
    expect(resultado).toBe(false);
  });
});
