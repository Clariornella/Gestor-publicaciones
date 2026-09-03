import Usuario from "../../Usuario.js";
import Publicacion from "../../Publicacion.js";
import RepositorioPublicaciones from "../../Repositoriopublicaciones.js";

const repositorio = new RepositorioPublicaciones();

const usuario1 = new Usuario("Juan Pérez", "juanperez@gmail.com");
const usuario2 = new Usuario("María López", "marialopez@gmail.com");
const usuario3 = new Usuario("Carlos García", "carlosgarcia@gmail.com");

const publicacion1 = new Publicacion(
  "Mi primer post",
  "Este es el contenido de mi primer post.",
  usuario1,
);
const publicacion2 = new Publicacion(
  "Mi segundo post",
  "Este es el contenido de mi segundo post.",
  usuario2,
);
const publicacion3 = new Publicacion(
  "Mi tercer post",
  "Este es el contenido de mi tercer post.",
  usuario3,
);

const publicacion4 = new Publicacion(
  "Mi cuarto post",
  "Este es el contenido de mi cuarto post.",
  usuario1,
);

const publicacion5 = new Publicacion(
  "Mi quinto post",
  "Este es el contenido de mi quinto post.",
  usuario2,
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

function buscarPublicacionPorTitulo(publicaciones, tituloBuscado) {
  const termino = tituloBuscado.trim().toLowerCase();

  return publicaciones.find(
    (pub) => pub.titulo.trim().toLowerCase() === termino,
  );
}

const busqueda1 = buscarPublicacionPorTitulo(publicaciones, "mi primer post");
const busqueda2 = buscarPublicacionPorTitulo(publicaciones, "Post Inexistente");

if (busqueda1) {
  console.log(`Encontrada: ${busqueda1.mostrarResumen()}`);
} else {
  console.log("No se encontró ninguna publicación con ese título.");
}

if (busqueda2) {
  console.log(`Encontrada: ${busqueda2.mostrarResumen()}`);
} else {
  console.log("No se encontró ninguna publicación con ese título.");
}
