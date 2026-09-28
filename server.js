// =============================================================================
// MÓDULOS DE NODE.JS, EXPRESS Y DOMINIO
// -----------------------------------------------------------------------------
// [TP: Día 12 · Clase 15 de Teoría: Cliente, servidor y dominio - Parte 2]
// - path y fileURLToPath resuelven rutas absolutas independientes del directorio
//   desde donde se lance el proceso de Node.
// - express instancia la aplicación servidora HTTP.
// [TP: Día 14 · Clase Teórica 17: Repositorios y operaciones CRUD - Parte 5]
// - crearRouterPublicaciones importa la fábrica modular de rutas bajo /publicaciones.
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Partes 4 y 7]
// - RepositorioPublicaciones maneja la colección con persistencia en disco.
// - paraExponer y convertirAXML suministran los conversores para responder en JSON o XML.
// =============================================================================

import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";
import { paraExponer, convertirAXML } from "./src/formatos.js";
// PASO 5C: importar la fábrica del router
import crearRouterPublicaciones from "./routes/publicaciones.routes.js";

// =============================================================================
// CONFIGURACIÓN DE RUTAS Y MIDDLEWARES
// -----------------------------------------------------------------------------
// [TP: Día 12 · Clase 15 de Teoría - Parte 2]
// - express.static sirve la interfaz del cliente (index.html, styles.css, app.js)
//   usando una ruta absoluta fija.
// [TP: Día 16 · Clase 16 de Teoría: Alta con validación en servidor - Parte 3]
// - express.json() y express.urlencoded({ extended: true }) se registran antes
//   de las rutas para parsear los cuerpos de las solicitudes en req.body.
// [TP: Día 15 · Clase Teórica 18 - Parte 7: Persistencia - preparar y cargar]
// - Se define RUTA_DATOS apuntando a data/publicaciones.json e instanciando el repositorio.
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUTA_DATOS = path.join(__dirname, "data", "publicaciones.json");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const repositorio = new RepositorioPublicaciones(RUTA_DATOS);

// =============================================================================
// DIAGNÓSTICO: DOS REPRESENTACIONES DE LA MISMA COLECCIÓN
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18 - Parte 4: Servidor: dos representaciones]
// EXPLICACIÓN:
// - GET /datos/publicaciones.json: usa res.json(), que automáticamente serializa
//   el arreglo mapeado por paraExponer() y fija Content-Type: application/json.
// - GET /datos/publicaciones.xml: Express no serializa XML por defecto; por ende,
//   se define explícitamente res.type("application/xml") antes de despachar
//   el documento generado por convertirAXML() mediante .send().
// =============================================================================

// Rutas previas (ej: /estado-comunidad, /estado-inactivas)...
app.get("/datos/publicaciones.json", (req, res) => {
  res.json(repositorio.listar().map(paraExponer));
});

app.get("/datos/publicaciones.xml", (req, res) => {
  const publicaciones = repositorio.listar().map(paraExponer);
  res.type("application/xml").send(convertirAXML(publicaciones));
});

// =============================================================================
// MONTAJE DEL ROUTER MODULAR CON INYECCIÓN DE DEPENDENCIAS
// -----------------------------------------------------------------------------
// [TP: Día 14 · Clase Teórica 17 - Paso 5C: Integración router en /publicaciones]
// EXPLICACIÓN:
// No se instancia un nuevo repositorio: se inyecta por parámetro la MISMA
// instancia compartida para que todas las operaciones (GET, POST, etc.)
// afecten a la misma colección en memoria y archivo.
// =============================================================================
// PASO 5C: montar el router en /publicaciones pasándole la MISMA instancia
app.use("/publicaciones", crearRouterPublicaciones(repositorio));

// =============================================================================
// ARRANQUE ASÍNCRONO Y SEMBRADO INICIAL (SEED)
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18 - Paso 8D: Persistencia - guardar e integrar]
// EXPLICACIÓN:
// - await repositorio.cargar(): carga obligatoria antes de comenzar a escuchar
//   peticiones HTTP, reconstruyendo publicaciones previas desde el archivo de disco.
// - Sembrado de datos (seed): si el archivo recién se crea y la lista queda en 0,
//   agrega automáticamente dos publicaciones iniciales válidas para que la
//   aplicación no arranque vacía.
// - app.listen(3000): levanta el servidor web en el puerto 3000.
// =============================================================================
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
