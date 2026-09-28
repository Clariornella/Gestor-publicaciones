import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RepositorioPublicaciones } from "../src/RepositorioPublicaciones.js";
import { Publicacion } from "../src/Publicacion.js";

const CONTENIDO_VALIDO = "Descripción válida con más de veinte caracteres.";

describe("Persistencia de publicaciones", () => {
  let carpeta;

  beforeEach(async () => {
    carpeta = await mkdtemp(join(tmpdir(), "publicaciones-"));
  });

  afterEach(async () => {
    await rm(carpeta, { recursive: true, force: true });
  });

  test("una segunda instancia con la misma ruta recupera lo que la primera guardó", async () => {
    const ruta = join(carpeta, "datos.json");
    const a = new RepositorioPublicaciones(ruta);
    await a.cargar();
    await a.agregar("Ana", "Apuntes de Redes", CONTENIDO_VALIDO, "aviso");

    const b = new RepositorioPublicaciones(ruta);
    await b.cargar();

    expect(b.listar()).toHaveLength(1);
    expect(b.listar()[0]).toBeInstanceOf(Publicacion);
    expect(b.listar()[0].titulo).toBe("Apuntes de Redes");
  });

  test("cargar reconstruye instancias y recupera el próximo ID", async () => {
    const ruta = join(carpeta, "publicaciones.json");
    const original = new RepositorioPublicaciones(ruta);
    const publicacion = await original.agregar(
      "Ana",
      "Apuntes de Redes",
      CONTENIDO_VALIDO,
      "general",
    );
    publicacion.agregarEtiqueta("redes");
    publicacion.darDeBaja();
    await original.guardar();

    const recuperado = new RepositorioPublicaciones(ruta);
    await recuperado.cargar();
    const cargada = recuperado.buscarPorId(1);

    expect(cargada).toBeInstanceOf(Publicacion);
    expect(cargada.mostrarResumen()).toContain("Apuntes de Redes");
    expect(cargada.activa).toBe(false);
    expect(cargada.etiquetas).toEqual(["redes"]);
    expect(
      (
        await recuperado.agregar(
          "Luis",
          "Segundo título",
          "Otra descripción válida con más de veinte caracteres.",
          "general",
        )
      ).id,
    ).toBe(2);
  });

  test("cargar crea un archivo vacío cuando todavía no existe", async () => {
    const ruta = join(carpeta, "subdirectorio", "publicaciones.json");
    const repositorio = new RepositorioPublicaciones(ruta);

    await repositorio.cargar();

    expect(repositorio.listar()).toEqual([]);
    expect(await readFile(ruta, "utf8")).toBe("[]");
  });
});
