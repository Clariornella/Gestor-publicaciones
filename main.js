import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

const repositorio = new RepositorioPublicaciones();

repositorio.on("publicacionAgregada", (pub) => {
  console.log(`Se ha agregado una nueva publicación: ${pub.titulo}`);
});

let contador = 0;

repositorio.on("publicacionAgregada", (publicacion) => {
  contador++;
  console.log(`Van: ${contador} publicaciones en total`);
});

const usuario1 = new Usuario("Juan Pérez", "juan@mail.com");

const p1 = new Publicacion(
  "Mi primer post",
  "Este es el contenido de mi primer post",
  usuario1,
);
const p2 = new PublicacionVenta(
  "Venta de bicicleta",
  "Bicicleta en buen estado",
  usuario1,
  150,
);
const p3 = new PublicacionServicio(
  "Clases de guitarra",
  "Ofrezco clases de guitarra para principiantes",
  usuario1,
  20,
);

repositorio.agregar(p1);
repositorio.agregar(p2);
repositorio.agregar(p3);

// function publicarConDemora(publicacion, callback) {
//   setTimeout(() => {
//     callback(publicacion);
//   }, 2000);
// }

// publicarConDemora(p1, (publicacion) => {
//   repositorio.agregar(publicacion);
//   console.log("Mensaje con demora");
// });

// console.log("Mensaje sin demora");

function publicarConDemoraPromise(publicacion) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Publicación agregada: ${publicacion.titulo}`);
    }, 2000);
  });
}

async function publicar() {
  console.log("Mensaje sin demora");
  const mensaje = await publicarConDemoraPromise(p1);
  console.log(mensaje);
}

publicar();
