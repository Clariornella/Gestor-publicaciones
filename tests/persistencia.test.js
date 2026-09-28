// =============================================================================
// SUITE DE PRUEBAS DE PERSISTENCIA EN ARCHIVO
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Parte 9: Probar con carpeta temporal]
// EXPLICACIÓN GENERAL:
// Verifica que RepositorioPublicaciones persista y recupere datos reales en disco (operaciones I/O)
// sin depender de la memoria del proceso.
// - Regla de aislamiento: los tests NUNCA deben leer ni escribir sobre el archivo de producción
//   (data/publicaciones.json) para no ensuciar la base de datos real.
// - Solución: cada prueba crea un directorio temporal aislado con mkdtemp y lo elimina en afterEach.
// =============================================================================

import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RepositorioPublicaciones } from "../src/RepositorioPublicaciones.js";
import { Publicacion } from "../src/Publicacion.js";

const CONTENIDO_VALIDO = "Descripción válida con más de veinte caracteres.";

describe("Persistencia de publicaciones", () => {
  let carpeta;

  // ===========================================================================
  // CICLO DE VIDA (BEFOREEACH / AFTEREACH)
  // ---------------------------------------------------------------------------
  // [TP: Día 15 · Clase Teórica 18 - Parte 9]
  // EXPLICACIÓN:
  // - beforeEach: genera una carpeta temporal única en el sistema operativo
  //   (tmpdir/publicaciones-XXXXXX) para aislar por completo cada test.
  // - afterEach: limpia y borra recursivamente la carpeta temporal (rm con recursive y force)
  //   evitando dejar residuos en el disco una vez terminada la prueba.
  // ===========================================================================
  beforeEach(async () => {
    carpeta = await mkdtemp(join(tmpdir(), "publicaciones-"));
  });

  afterEach(async () => {
    await rm(carpeta, { recursive: true, force: true });
  });

  // ===========================================================================
  // TEST 1: RECUPERACIÓN ENTRE INSTANCIAS (SOBREVIVIR AL REINICIO)
  // ---------------------------------------------------------------------------
  // [TP: Día 15 · Clase Teórica 18 - Parte 9 - Paso 9]
  // EXPLICACIÓN:
  // - Simula el apagado y encendido del servidor: la instancia 'a' agrega una publicación
  //   y la persiste en disco mediante await a.agregar(...).
  // - Se crea una segunda instancia independiente 'b' apuntando exactamente a la misma ruta
  //   y se llama a await b.cargar().
  // - Comprueba que 'b' recupere la publicación persistida por 'a', verificando con
  //   toBeInstanceOf(Publicacion) que no sea un objeto plano (POJO) sino una instancia con métodos.
  // ===========================================================================
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

  // ===========================================================================
  // TEST 2: RECONSTRUCCIÓN COMPLETA DE ESTADO Y RECUPERACIÓN DE PROXIMOID
  // ---------------------------------------------------------------------------
  // [TP: Día 15 · Clase Teórica 18 - Parte 7: Paso 7A]
  // EXPLICACIÓN:
  // - Modifica propiedades del ciclo de vida (etiquetas y darDeBaja) y guarda el archivo.
  // - Al invocar cargar() en una nueva instancia, verifica que:
  //   1. Se reconstruyan correctamente las clases del dominio (cargada instanceof Publicacion).
  //   2. Los métodos polimórficos sigan funcionando (cargada.mostrarResumen()).
  //   3. Se restablezcan atributos clave (activa en false, arreglo de etiquetas).
  //   4. Recalcule this.proximoId como Math.max(...ids) + 1 para que una nueva publicación
  //      reciba el ID correlativo correcto (id: 2) sin colisionar con los existentes.
  // ===========================================================================
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

  // ===========================================================================
  // TEST 3: MANEJO DEL ARCHIVO INEXISTENTE (ERROR ENOENT)
  // ---------------------------------------------------------------------------
  // [TP: Día 15 · Clase Teórica 18 - Parte 7: Paso 7B]
  // EXPLICACIÓN:
  // - Comprueba el escenario de arranque en frío cuando el archivo en disco todavía no existe.
  // - Si readFile lanza un error con código "ENOENT" (Error No Entity), el bloque catch no debe
  //   hacer caer la aplicación: debe inicializar la colección vacía ([]) y crear físicamente
  //   el archivo en disco escribiendo "[]" mediante mkdir y writeFile.
  // ===========================================================================
  test("cargar crea un archivo vacío cuando todavía no existe", async () => {
    const ruta = join(carpeta, "subdirectorio", "publicaciones.json");
    const repositorio = new RepositorioPublicaciones(ruta);

    await repositorio.cargar();

    expect(repositorio.listar()).toEqual([]);
    expect(await readFile(ruta, "utf8")).toBe("[]");
  });
});
