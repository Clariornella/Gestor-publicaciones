import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";
import { paraExponer, convertirAXML } from "./src/formatos.js";
// PASO 5C: importar la fábrica del router
import crearRouterPublicaciones from "./routes/publicaciones.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUTA_DATOS = path.join(__dirname, "data", "publicaciones.json");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const repositorio = new RepositorioPublicaciones(RUTA_DATOS);

// Rutas previas (ej: /estado-comunidad, /estado-inactivas)...
app.get("/datos/publicaciones.json", (req, res) => {
  res.json(repositorio.listar().map(paraExponer));
});

app.get("/datos/publicaciones.xml", (req, res) => {
  const publicaciones = repositorio.listar().map(paraExponer);
  res.type("application/xml").send(convertirAXML(publicaciones));
});

// PASO 5C: montar el router en /publicaciones pasándole la MISMA instancia
app.use("/publicaciones", crearRouterPublicaciones(repositorio));

await repositorio.cargar();

if (repositorio.listar().length === 0) {
  await repositorio.agregar(
    "Ana",
    "Apuntes de Redes",
    "Material de estudio sobre redes y desarrollo web.",
    "general",
  );
  await repositorio.agregar(
    "Luis",
    "Clases de JavaScript",
    "Servicio de apoyo para aprender JavaScript desde cero.",
    "evento",
  );
}

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
