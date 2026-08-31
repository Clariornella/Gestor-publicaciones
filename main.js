import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import RepositorioPublicaciones from "./Repositoriopublicaciones.js";

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

const nombres = ['Juan Pérez'];

nombres.forEach(nombre => {
  const resultados = repositorio.buscarPorUsuario(nombre);
  console.log(`\n--- Publicaciones de "${nombre}" (Total: ${resultados.length}) ---`);
  resultados.forEach(p => console.log(`- ${p.mostrarResumen()}`));
});


console.log(`\n--- Desafío: Cantidad Total ---`);
console.log(`Total de publicaciones en el repositorio: ${repositorio.cantidadTotal()}`);

console.log(`\n--- Desafío: Publicaciones Activas ---`);
const activas = repositorio.filtrarActivas();
console.log(`Cantidad activas: ${activas.length}`);

// console.log("--- 1. Listado de Publicaciones (forEach) ---");
// publicaciones.forEach((pub) => {
//   console.log(pub.mostrarResumen());
// });

// const publicacionesActivas = publicaciones.filter((pub) => pub.estaActiva());

// console.log("\n--- 2. Publicaciones Activas (filter) ---");
// publicacionesActivas.forEach((pub) => {
//   console.log(`- ${pub.mostrarResumen()}`);
// });

// const nombreBuscado = "María López";
// const primeraPublicacion = publicaciones.find(
//   (pub) => pub.autor.nombre === nombreBuscado,
// );

// console.log(`\n--- 3. Primera publicación de "${nombreBuscado}" (find) ---`);
// if (primeraPublicacion) {
//   console.log(`Encontrada: ${primeraPublicacion.mostrarResumen()}`);
//   console.log(`Descripción: ${primeraPublicacion.descripcion}`);
// } else {
//   console.log(`No se encontró ninguna publicación para ${nombreBuscado}.`);
// }
