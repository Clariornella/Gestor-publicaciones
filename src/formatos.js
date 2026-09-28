// Convierte una publicación de dominio en la representación pública de la API.
export function paraExponer(publicacion) {
  return {
    id: publicacion.id,
    autor: publicacion.autor,
    titulo: publicacion.titulo,
    descripcion: publicacion.descripcion,
    categoria: publicacion.categoria,
    activa: publicacion.activa,
    etiquetas: [...publicacion.etiquetas],
    estado: publicacion.estado,
  };
}

export function convertirAJSON(publicaciones) {
  return JSON.stringify(publicaciones.map(paraExponer));
}

export function convertirDesdeJSON(texto) {
  return JSON.parse(texto);
}

function escaparXML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function publicacionAXML(publicacion) {
  const datos = paraExponer(publicacion);
  const etiquetas = datos.etiquetas.map(escaparXML).join(", ");

  return `  <publicacion id="${escaparXML(datos.id)}">
    <autor>${escaparXML(datos.autor)}</autor>
    <titulo>${escaparXML(datos.titulo)}</titulo>
    <descripcion>${escaparXML(datos.descripcion)}</descripcion>
    <categoria>${escaparXML(datos.categoria)}</categoria>
    <activa>${escaparXML(datos.activa)}</activa>
    <etiquetas>${etiquetas}</etiquetas>
    <estado>${escaparXML(datos.estado)}</estado>
  </publicacion>`;
}

export function convertirAXML(publicaciones) {
  const elementos = publicaciones.map(publicacionAXML).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<publicaciones>
${elementos}
</publicaciones>`;
}
