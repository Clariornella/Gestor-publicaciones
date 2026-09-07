import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

const repositorio = new RepositorioPublicaciones();

const u1 = new Usuario("Juan Pérez", "juan@mail.com");
const u2 = new Usuario("María López", "maria@mail.com");
const u3 = new Usuario("Carlos Gómez", "carlos@mail.com");

const venta1 = new PublicacionVenta(
  "Apuntes de Álgebra",
  "Resumen parcial",
  u1,
  1200,
);
const servicio1 = new PublicacionServicio(
  "Clases de JS",
  "Nivel inicial",
  u2,
  "virtual",
  60,
);
const servicio2 = new PublicacionServicio(
  "Clases de Python",
  "Nivel intermedio",
  u3,
  "presencial",
  90,
);
const venta2 = new PublicacionVenta("Calculadora", "Casio fx-991", u1, 4500);

repositorio.agregar(venta1);
repositorio.agregar(servicio1);
repositorio.agregar(servicio2);
repositorio.agregar(venta2);


console.log("--- Resúmenes (Polimorfismo con .map()) ---");
const resumenes = repositorio.listarResumenes();
console.log(resumenes);


console.log("\n--- Solo PublicacionVenta ---");
const soloVentas = repositorio.filtrarPorTipo(PublicacionVenta);
soloVentas.forEach((p) => console.log(`- ${p.mostrarResumen()}`));

console.log("\n--- Solo PublicacionServicio ---");
const soloServicios = repositorio.filtrarPorTipo(PublicacionServicio);
soloServicios.forEach((p) => console.log(`- ${p.mostrarResumen()}`));

console.log("\n--- Por superclase Publicacion ---");
const todas = repositorio.filtrarPorTipo(Publicacion);
console.log(`Total: ${todas.length}`);
