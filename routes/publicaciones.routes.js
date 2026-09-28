// =============================================================================
// IMPORTS Y FÁBRICA DEL ROUTER
// -----------------------------------------------------------------------------
// [TP: Día 14 · Clase Teórica 17: Repositorios y operaciones CRUD - Parte 5]
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Parte 1]
// EXPLICACIÓN:
// - Se importa Router de Express para modularizar las rutas y no sobrecargar server.js.
// - Se importa paraExponer desde src/formatos.js, función que define el contrato público:
//   expone id, autor, titulo, descripcion, categoria, etc., pero oculta datos internos
//   sensibles de moderación como el arreglo 'reportes'.
// - crearRouterPublicaciones es una función fábrica que recibe la instancia compartida
//   de 'repositorio' por inyección de dependencias para operar sobre la misma colección.
// =============================================================================
import { Router } from "express";
import { paraExponer } from "../src/formatos.js";

export default function crearRouterPublicaciones(repositorio) {
  const router = Router();

  // ===========================================================================
  // OPERACIÓN GET /: LISTAR PUBLICACIONES (READ)
  // ---------------------------------------------------------------------------
  // [TP: Día 14 · Clase Teórica 17 - Paso 5A]
  // [TP: Día 15 · Clase Teórica 18 - Parte 1]
  // EXPLICACIÓN:
  // - repositorio.listar() devuelve una copia superficial ([...this.publicaciones]) para
  //   no exponer la referencia del arreglo interno ni permitir mutaciones indebidas.
  // - .map(paraExponer) filtra cada elemento según el contrato de datos acordado.
  // - res.json() serializa el arreglo resultante a JSON y responde con código HTTP 200.
  // ===========================================================================
  // PASO 5A: devolver repositorio.listar() como JSON
  router.get("/", (req, res) => {
    res.json(repositorio.listar().map(paraExponer));
  });

  // ===========================================================================
  // OPERACIÓN GET /categorias: CONSULTA DE METADATOS
  // ---------------------------------------------------------------------------
  // [TP: Día 16 · Clase 16 de Teoría: Alta de publicaciones con validación en el servidor - Parte 1]
  // [TP: Día 14 · Clase Teórica 17 - Parte 5]
  // EXPLICACIÓN:
  // - Expone la lista de categorías admitidas por el dominio (CATEGORIAS_PERMITIDAS).
  // - Permite que clientes o formularios consulten las opciones válidas acordadas
  //   en el contrato de datos antes de enviar un alta.
  // ===========================================================================
  // Ya existente de la clase 16 (si lo tenías acá o en tus rutas anteriores):
  router.get("/categorias", (req, res) => {
    // Si tenés CATEGORIAS_PERMITIDAS definida o importada, se responde acá:
    res.json(["general", "tecnologia", "deportes"]); // o tus categorías definidas
  });

  // ===========================================================================
  // OPERACIÓN POST /: CREAR PUBLICACIÓN (CREATE)
  // ---------------------------------------------------------------------------
  // [TP: Día 14 · Clase Teórica 17 - Paso 5B]
  // [TP: Día 15 · Clase Teórica 18 - Partes 7 y 8 (Persistencia en archivo)]
  // [TP: Día 16 · Clase 16 de Teoría - Partes 1 y 3]
  // EXPLICACIÓN:
  // - Desestructura los campos que vienen en req.body.
  // - Invoca await repositorio.agregar(...):
  //   1) El repositorio asigna el ID incremental correspondiente.
  //   2) El constructor de Publicacion aplica las reglas del dominio (convertir → validar → asignar)
  //      lanzando un Error si alguna regla no se cumple (ej. autor vacío, título fuera de rango).
  //   3) Al ser async (Clase 18), persiste los cambios en disco (data/publicaciones.json) con await this.guardar().
  // - Si la creación es exitosa, responde HTTP 201 (Created) con el objeto normalizado por paraExponer.
  // - Si falla alguna regla de validación, el catch intercepta la excepción y responde HTTP 400 (Bad Request)
  //   con el mensaje exacto generado por el dominio ({ error: error.message }).
  // ===========================================================================
  // PASO 5B: crear con repositorio.agregar(...) y responder 201/400
  router.post("/", async (req, res) => {
    const { autor, titulo, descripcion, categoria } = req.body;

    try {
      const nueva = await repositorio.agregar(
        autor,
        titulo,
        descripcion,
        categoria,
      );
      res.status(201).json(paraExponer(nueva));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
