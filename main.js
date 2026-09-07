import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

const repositorio = new RepositorioPublicaciones();

const usuario1 = new Usuario("Juan Pérez", "juanperez@gmail.com");
const usuario2 = new Usuario("María López", "marialopez@gmail.com");
const usuario3 = new Usuario("Carlos García", "carlosgarcia@gmail.com");

// Reemplazo de instancias sueltas de Publicacion por subclases mezcladas
const publicacion1 = new PublicacionVenta(
  "Mi primer post",
  "Este es el contenido de mi primer post.",
  usuario1,
  1500
);

const publicacion2 = new PublicacionServicio(
  "Mi segundo post",
  "Este es el contenido de mi segundo post.",
  usuario2,
  "virtual",
  60
);

const publicacion3 = new PublicacionVenta(
  "Mi tercer post",
  "Este es el contenido de mi tercer post.",
  usuario3,
  3200
);

const publicacion4 = new PublicacionServicio(
  "Mi cuarto post",
  "Este es el contenido de mi cuarto post.",
  usuario1,
  "presencial",
  120
);

const publicacion5 = new PublicacionVenta(
  "Mi quinto post",
  "Este es el contenido de mi quinto post.",
  usuario2,
  500
);

publicacion1.activa = false; // Desactivar la primera publicación

repositorio.agregar(publicacion1);
repositorio.agregar(publicacion2);
repositorio.agregar(publicacion3);
repositorio.agregar(publicacion4);
repositorio.agregar(publicacion5);

const publicaciones = [
  publicacion1,
  publicacion2,
  publicacion3,
  publicacion4,
  publicacion5,
];
