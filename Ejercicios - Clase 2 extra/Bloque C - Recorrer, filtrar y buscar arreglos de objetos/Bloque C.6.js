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

publicaciones.forEach((publicacion) => {
  const nombreAutor =
    (publicacion.autor && publicacion.autor.nombre) || "Autor desconocido";

  const ahora = new Date();
  const milisegundos = ahora - publicacion.fechaPublicacion;
  const dias = Math.floor(milisegundos / (1000 * 60 * 60 * 24));

  console.log(
    `Título: ${publicacion.titulo}, Autor: ${nombreAutor}, Días desde publicación: ${dias}`,
  );
});
