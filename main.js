import Publicacion from "./Publicacion.js";

const publicacion1 = new Publicacion(
  "Mi primer post",
  "Este es el contenido de mi primer post.",
  "Juan Pérez",
);

const publicacion2 = new Publicacion(
  "Mi segundo post",
  "Este es el contenido de mi segundo post.",
  "María López",
);

const publicacion3 = new Publicacion(
  "Mi tercer post",
  "Este es el contenido de mi tercer post.",
  "Carlos García",
);

const publicacion4 = new Publicacion(
  "Mi lo que quiera post",
  "Este es el contenido de mi cuarto post.",
  "Ana Martínez",
);

const publicacion5 = new Publicacion(
  "Mi quinto post",
  "Este es el contenido de mi quinto post.",
  "Luis Fernández",
);

publicacion1.activa = false; // Desactivar la primera publicación
publicacion3.activa = false; // Desactivar la tercera publicación
publicacion5.activa = false; // Desactivar la quinta publicación (nota: publicacion5 no está definida, esto podría causar un error)

const publicaciones = [
  publicacion1,
  publicacion2,
  publicacion3,
  publicacion4,
  publicacion5,
]; // publicacion5 no está definida, esto podría causar un error

// Opción con .filter()[cite: 1, 2, 4]:
const activas = publicaciones.filter((p) => p.estaActiva());
console.log(
  `Cantidad de publicaciones activas (usando filter): ${activas.length}`,
);

// Opción alternativa con for clásico:
let contadorActivas = 0;
for (let i = 0; i < publicaciones.length; i++) {
  if (publicaciones[i].estaActiva()) {
    contadorActivas++;
  }
}
console.log(
  `Cantidad de publicaciones activas (usando for): ${contadorActivas}`,
);

// --- 5. Imprimir solamente los títulos de las publicaciones activas ---
console.log("\nTítulos de publicaciones activas:");
activas.forEach((p) => {
  console.log(`- ${p.titulo}`);
});

const publicacionesJSON = JSON.stringify(publicaciones, null, 2);
console.log(publicacionesJSON);
