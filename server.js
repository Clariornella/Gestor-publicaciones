import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";
import { Publicacion } from "./src/Publicacion.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repositorio = new RepositorioPublicaciones();

// Instancias iniciales de prueba (autor, titulo, descripcion, categoria)
const p1 = new Publicacion(
  "Clara Ornella",
  "Libro de Álgebra I",
  "Edición con ejercicios prácticos resueltos",
  "compraventa",
);
p1.activa = true;

const p2 = new Publicacion(
  "Martín Pérez",
  "Tutorías Web",
  "Preparación parciales y finales de desarrollo web",
  "aviso", // <-- Reemplazá "servicio" por una válida (general, aviso, evento o compraventa)
);
p2.activa = true;

const p3 = new Publicacion(
  "Juan",
  "Calculadora vieja",
  "Usada en buen estado para cursar la materia",
  "compraventa",
);
p3.activa = false;

repositorio.agregar(p1);
repositorio.agregar(p2);
repositorio.agregar(p3);

// 1. Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// PARTE 3: Middleware urlencoded (antes de las rutas)
// ==========================================
app.use(express.urlencoded({ extended: false }));

// 2. Rutas GET anteriores
app.get("/estado-comunidad", (req, res) => {
  res.send(repositorio.obtenerEstado());
});

app.get("/api/publicaciones", (req, res) => {
  if (req.query.error === "1") {
    return res.status(500).json({ error: "Error forzado del servidor" });
  }
  res.json(repositorio.listar ? repositorio.listar() : []);
});

// ==========================================
// PARTE 3: Ruta POST /publicaciones
// ==========================================
app.post("/publicaciones", (req, res) => {
  try {
    const publicacion = new Publicacion(
      req.body.autor,
      req.body.titulo,
      req.body.descripcion,
      req.body.categoria,
    );
    repositorio.agregar(publicacion);
    res.status(201).send(publicacion.mostrarResumen());
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// 3. Inicio del servidor
app.listen(3000, () => console.log("http://localhost:3000"));
