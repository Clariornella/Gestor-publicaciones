import { Router } from "express";

export default function crearRouterPublicaciones(repositorio) {
  const router = Router();

  // PASO 5A: devolver repositorio.listar() como JSON
  router.get("/", (req, res) => {
    res.json(repositorio.listar());
  });

  // Ya existente de la clase 16 (si lo tenías acá o en tus rutas anteriores):
  router.get("/categorias", (req, res) => {
    // Si tenés CATEGORIAS_PERMITIDAS definida o importada, se responde acá:
    res.json(["general", "tecnologia", "deportes"]); // o tus categorías definidas
  });

  // PASO 5B: crear con repositorio.agregar(...) y responder 201/400
  router.post("/", (req, res) => {
    const { autor, titulo, descripcion, categoria } = req.body;

    try {
      const nueva = repositorio.agregar(autor, titulo, descripcion, categoria);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
