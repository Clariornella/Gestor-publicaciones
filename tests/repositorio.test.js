import { RepositorioPublicaciones } from "../src/RepositorioPublicaciones.js";

describe("RepositorioPublicaciones · CRUD", () => {
  let repositorio;

  beforeEach(() => {
    repositorio = new RepositorioPublicaciones();
  });

  // PASO 6A: Agregar asigna IDs crecientes desde 1
  test("agregar asigna ids crecientes a partir de 1", () => {
    const pub1 = repositorio.agregar(
      "Clara",
      "Primer Libro",
      "Descripcion con mas de veinte caracteres para validar.",
      "general"
    );
    const pub2 = repositorio.agregar(
      "Martin",
      "Segundo Libro",
      "Otra descripcion con mas de veinte caracteres valida.",
      "general"
    );

    expect(pub1.id).toBe(1);
    expect(pub2.id).toBe(2);
  });

  // PASO 6B: listar devuelve una copia desacoplada
  test("listar devuelve una copia: modificarla no afecta al repositorio", () => {
    repositorio.agregar(
      "Clara",
      "Titulo de prueba",
      "Descripcion con mas de veinte caracteres para validar.",
      "general"
    );

    const copia = repositorio.listar();
    copia.pop(); // Modificamos el arreglo devuelto

    expect(copia).toHaveLength(0);
    expect(repositorio.listar()).toHaveLength(1);
  });

  // PASO 6C: Actualizar con datos inválidos no altera el estado de la colección
  test("actualizar con datos inválidos no modifica la colección", () => {
    const original = repositorio.agregar(
      "Clara",
      "Titulo Original",
      "Descripcion valida original de mas de veinte caracteres.",
      "general"
    );

    // Intentamos actualizar con una descripción menor a 20 caracteres (rompe la validación)
    expect(() => {
      repositorio.actualizar(original.id, {
        descripcion: "Corta"
      });
    }).toThrow();

    // Verificamos que la publicación original siga intacta
    const guardada = repositorio.buscarPorId(original.id);
    expect(guardada.descripcion).toBe("Descripcion valida original de mas de veinte caracteres.");
    expect(guardada.titulo).toBe("Titulo Original");
  });

  // PASO 6D: Eliminar con ID inexistente devuelve false
  test("eliminar una publicación inexistente devuelve false", () => {
    const resultado = repositorio.eliminar(999);
    expect(resultado).toBe(false);
  });
});
