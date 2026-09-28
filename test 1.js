import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";
import { Publicacion } from "./src/Publicacion.js";

const repo = new RepositorioPublicaciones();

// Creamos publicaciones: dos activas y una inactiva
const p1 = new Publicacion("Clases de guitarra", "desc", "autor", 15000);
p1.activa = true;

const p2 = new Publicacion("Venta de bicicleta", "desc", "autor", 80000);
p2.activa = true;

const p3 = new Publicacion("Sillón usado", "desc", "autor", 30000);
p3.activa = false; // dada de baja

// Agregamos al repositorio
repo.agregar(p1);
repo.agregar(p2);
repo.agregar(p3);

// Probamos el método nuevo
console.log(repo.obtenerEstado());