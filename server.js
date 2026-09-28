import express from "express";
import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";
// PASO 5C: importar la fábrica del router
import crearRouterPublicaciones from "./routes/publicaciones.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const repositorio = new RepositorioPublicaciones();

// Rutas previas (ej: /estado-comunidad, /estado-inactivas)...

// PASO 5C: montar el router en /publicaciones pasándole la MISMA instancia
app.use("/publicaciones", crearRouterPublicaciones(repositorio));

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
