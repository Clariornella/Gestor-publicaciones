import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";


import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";
import { Publicacion } from "./src/Publicacion.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const repositorio = new RepositorioPublicaciones();

const p1 = new Publicacion("Libro de Álgebra I", "Edición con ejercicios", "Clara Ornella", 12000);
p1.activa = true;

const p2 = new Publicacion("Tutorías Web", "Preparación parciales", "Martín Pérez", 8000);
p2.activa = true;

const p3 = new Publicacion("Calculadora vieja", "Usada", "Juan", 5000);
p3.activa = false; // dada de baja / inactiva

repositorio.agregar(p1);
repositorio.agregar(p2);
repositorio.agregar(p3);


app.use(express.static(path.join(__dirname, "public")));


app.get("/estado-comunidad", (req, res) => {
  res.send(repositorio.obtenerEstado());
});


app.get("/api/publicaciones", (req, res) => {
  if (req.query.error === "1") {
    return res.status(500).json({ error: "Error forzado del servidor" });
  }
  res.json(repositorio.listar ? repositorio.listar() : []);
});


app.listen(3000, () => console.log("http://localhost:3000"));