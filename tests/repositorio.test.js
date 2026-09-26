import { RepositorioPublicaciones } from "../src/RepositorioPublicaciones.js";
import { Publicacion } from "../src/Publicacion.js";

describe("RepositorioPublicaciones", () => {
  test("buscarPorEtiqueta devuelve coincidencias activas", () => {
    const repositorio = new RepositorioPublicaciones();
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.agregarEtiqueta("redes");
    repositorio.agregar(publicacion);
    expect(repositorio.buscarPorEtiqueta("redes")).toEqual([publicacion]);
  });
  test("una publicación dada de baja queda excluida", () => {
    const repositorio = new RepositorioPublicaciones();
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.agregarEtiqueta("redes");
    publicacion.darDeBaja();
    repositorio.agregar(publicacion);
    expect(repositorio.buscarPorEtiqueta("redes")).toEqual([]);
  });
  test("una etiqueta inexistente devuelve un arreglo vacío", () => {
    const repositorio = new RepositorioPublicaciones();
    expect(repositorio.buscarPorEtiqueta("inexistente")).toEqual([]);
  });
});

describe("Parte 3 · Consulta del repositorio", () => {
  let repo;

  beforeEach(() => {
    repo = new RepositorioPublicaciones();
  });

  test("pendientesDeRevision devuelve solo publicaciones activas que requieren revisión", () => {
    const p1 = new Publicacion("Ana", "Pub 1", "Contenido");
    const p2 = new Publicacion("Juan", "Pub 2", "Contenido");
    const p3 = new Publicacion("Luis", "Pub 3", "Contenido");

    // p1: 3 reportes y activa -> DEBE aparecer
    p1.reportar("u1", "Spam");
    p1.reportar("u2", "Spam");
    p1.reportar("u3", "Spam");

    // p2: solo 2 reportes y activa -> NO debe aparecer
    p2.reportar("u1", "Spam");
    p2.reportar("u2", "Spam");

    // p3: 3 reportes pero inactiva -> NO debe aparecer
    p3.reportar("u1", "Spam");
    p3.reportar("u2", "Spam");
    p3.reportar("u3", "Spam");
    p3.activa = false;

    repo.agregar(p1);
    repo.agregar(p2);
    repo.agregar(p3);

    const pendientes = repo.pendientesDeRevision();

    expect(pendientes).toHaveLength(1);
    expect(pendientes).toContain(p1);
  });
});
