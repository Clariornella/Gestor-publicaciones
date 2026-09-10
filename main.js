import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

function validarPublicacion(publicacion, reglas) {
  if (publicacion.titulo.length < reglas.minTitulo) {
    return false;
  }
  return true;
}

const repositorio = new RepositorioPublicaciones();

const autor1 = new Usuario("Juan Pérez", "juan@mail.com");

const p1 = new Publicacion(
  "JavaScript",
  "Guia rapida",
  autor1,
);


const reglas = { minTitulo: 5 };

if (validarPublicacion(p1, reglas)) {
  repositorio.agregar(p1);
  console.log("Publicación agregada correctamente.");
} else {
  console.log("La publicación no cumple con las reglas de validación.");
}
