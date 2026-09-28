import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";

const repo = new RepositorioPublicaciones();

// 1. Creamos una publicación inicial (con descripción > 20 caracteres)
const original = repo.agregar(
  "Maria",
  "Primer post",
  "Esta es una descripcion valida de mas de veinte caracteres.",
  "general",
);

console.log("ID creado:", original.id); // 1

// 2. Probamos actualizar usando la instancia 'repo'
const actualizada = repo.actualizar(1, {
  titulo: "Título modificado con éxito",
  descripcion: "Esta es la nueva descripcion actualizada y tambien valida.",
});

console.log("¿Mantiene el mismo ID?:", actualizada.id === 1);
console.log(
  "¿Cambió el título?:",
  actualizada.titulo === "Título modificado con éxito",
);
console.log("¿Conservó el autor?:", actualizada.autor === "Maria");

// 3. Verificar que arroje error si no existe el ID
try {
  repo.actualizar(999, { titulo: "No existe" });
  console.log("ERROR: Debería haber fallado");
} catch (error) {
  console.log(
    "Atrapó error por publicación inexistente:",
    error.message === "Publicación inexistente",
  );
}

// 4. Verificar que el constructor revalide (ej: descripción menor a 20 caracteres)
try {
  repo.actualizar(1, { descripcion: "Muy corta" });
  console.log("ERROR: Debería haber fallado por validación");
} catch (error) {
  console.log(
    "Atrapó error por validación:",
    error.message.includes("descripcion"),
  );
}
// Prueba de eliminar
const eliminadoExitoso = repo.eliminar(1);
console.log("¿Eliminó publicación existente (id 1)?:", eliminadoExitoso); // true

const eliminadoInexistente = repo.eliminar(999);
console.log("¿Devolvió false para id inexistente?:", eliminadoInexistente === false); // true

console.log("¿La colección quedó vacía?:", repo.listar().length === 0); // true