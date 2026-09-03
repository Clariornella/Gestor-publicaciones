import Usuario from "../../Usuario.js";
import Publicacion from "../../Publicacion.js";

class RepositorioPublicaciones {
  constructor() {
    this.publicaciones = [];
  }

  agregar(publicacion) {
    this.publicaciones.push(publicacion);
  }

  buscarPorUsuario(nombre) {
    return this.publicaciones.filter((pub) => pub.autor.nombre === nombre);
  }

  filtrarActivas() {
    return this.publicaciones.filter((pub) => pub.activa === true);
  }

  cantidadTotal() {
    return this.publicaciones.length;
  }

  publicacionMasReciente() {
    if (this.publicaciones.length === 0) {
      return null;
    }

    let publicacionMasReciente = this.publicaciones[0];

    // Utilizo forEach porque puede recorrer el array de publicaciones y comparar las fechas de cada publicación con la fecha de la publicación más reciente encontrada hasta el momento. Si encuentra una publicación con una fecha más reciente, actualiza la variable publicacionMasReciente.
    this.publicaciones.forEach((pub) => {
      if (pub.fecha > publicacionMasReciente.fecha) {
        publicacionMasReciente = pub;
      }
    });

    return publicacionMasReciente;
  }

  // Metodo filter, porque permite filtrar las publicaciones por el nombre del autor y devolver un array con todas las publicaciones que coincidan con ese nombre. Luego, se obtiene la longitud de ese array para determinar la cantidad de publicaciones del usuario especificado.
  cantidadPorUsuario(nombre) {
    const publicacionesUsuario = this.publicaciones.filter(
      (pub) => pub.autor.nombre === nombre,
    );
    const nombreAutor = publicacionesUsuario[0]?.autor?.nombre || "Desconocido";
    return publicacionesUsuario.length;
  }

  //Metodo find, porque permite buscar la primera publicación activa en el array de publicaciones. Si encuentra una publicación activa, devuelve true; de lo contrario, devuelve false.
  existePublicacionActiva() {
    const encontrada = this.publicaciones.find((pub) => pub.activa === true);
    return encontrada !== undefined;
  }

  //Metodo forEach, porque permite recorrer el array de publicaciones activas y mostrar un resumen de cada una de ellas utilizando. Y metodo filter, porque permite filtrar las publicaciones activas antes de recorrerlas con forEach.
  resumenGeneral() {
    const activas = this.publicaciones.filter(
      (pub) => pub.activa === true,
    ).length;

    console.log(`Total de publicaciones activas: ${activas}`);
    this.publicaciones
      .filter((pub) => pub.activa === true)
      .forEach((pub) => {
        console.log(pub.mostrarResumen());
      });
  }
}

const repo = new RepositorioPublicaciones();

const user1 = new Usuario("Carlos Gómez", "carlos@mail.com"); //Tiene 2 posts
const user2 = new Usuario("María López", "maria@mail.com"); //Tiene 1 post

const post1 = new Publicacion("Introducción a JS", "Contenido 1", user1); //Mas reciente
const post2 = new Publicacion("Compañeros", "Contenido 2", user2);
const post3 = new Publicacion("Patrones de Diseño", "Contenido 3", user1);

post1.fechaPublicacion = new Date("2026-08-01");

post2.activa = false;


repo.agregar(post1);
repo.agregar(post2);
repo.agregar(post3);

const masNueva = repo.publicacionMasReciente();
console.log(
  `Más reciente: ${masNueva.titulo} (${masNueva.fechaPublicacion.toISOString()})`,
);

console.log(`Cantidad de Carlos: ${repo.cantidadPorUsuario("Carlos Gómez")}`);
console.log(`Cantidad de María: ${repo.cantidadPorUsuario("María López")}`);

console.log(
  `¿Existe "Introducción a JS" activa?: ${repo.existePublicacionActiva("Introducción a JS")}`,
);
console.log(
  `¿Existe "Compañeros" activa?: ${repo.existePublicacionActiva("Compañeros")}`,
);

console.log("\n--- Resumen General de Activas ---");
repo.resumenGeneral();
