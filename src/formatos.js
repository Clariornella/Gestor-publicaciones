// =============================================================================
// CONTRATO PÚBLICO DE DATOS (DATA TRANSFER OBJECT / PROYECCIÓN)
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Parte 1]
// EXPLICACIÓN:
// Define qué propiedades de la entidad de dominio Publicacion son públicas para
// la API y cuáles son privadas o internas
// - Expone: id, autor, titulo, descripcion, categoria, activa, etiquetas y estado.
// - Oculta intencionalmente: reportes (información sensible de moderación que
//   no debe enviarse hacia los clientes web por privacidad y seguridad).
// - Realiza una copia superficial del arreglo con [...publicacion.etiquetas] para
//   evitar que modificaciones externas alteren la colección del dominio en memoria.
// =============================================================================
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

// =============================================================================
// SERIALIZACIÓN Y PARSEO JSON
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Parte 2]
// [TP: Semana 1 · Día 1 - Parte 4: Serializar a JSON]
// EXPLICACIÓN:
// - convertirAJSON: Mapea cada instancia del arreglo con paraExponer() y la
//   transforma en una cadena de texto estructurada con JSON.stringify().
// - convertirDesdeJSON: Realiza el camino inverso mediante JSON.parse(texto),
//   reconstruyendo texto crudo a un arreglo de objetos planos de JavaScript (POJO),
//   los cuales no poseen métodos de clase de dominio.
// Ambas funciones son recíprocas (inversas entre sí).
// =============================================================================
export function convertirAJSON(publicaciones) {
  return JSON.stringify(publicaciones.map(paraExponer));
}

export function convertirDesdeJSON(texto) {
  return JSON.parse(texto);
}

// =============================================================================
// SANITIZACIÓN Y ESCAPADO DE CARACTERES RESERVADOS XML
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Parte 3A]
// EXPLICACIÓN:
// En XML ciertos caracteres forman parte de la sintaxis del lenguaje (<, >, &, ", ').
// Si un usuario ingresa por ejemplo "Ana & Cía" o "<avanzado>", rompería la estructura.
// Esta función reemplaza cada caracter prohibido por su entidad XML equivalente:
// 1. & -> &amp;  (debe reemplazarse siempre en primer lugar para evitar re-escapar las demás)
// 2. < -> &lt;
// 3. > -> &gt;
// 4. " -> &quot;
// 5. ' -> &apos;
// El operador valor ?? "" garantiza no fallar frente a nulos o indefinidos.
// =============================================================================
function escaparXML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// =============================================================================
// CONVERSIÓN DE UNA PUBLICACIÓN INDIVIDUAL A ELEMENTO XML
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Parte 3B]
// EXPLICACIÓN:
// - Filtra los datos públicos con paraExponer(publicacion).
// - Modela la identidad (id) como un atributo del elemento XML: <publicacion id="..."/>.
// - Mapea y escapa la lista de etiquetas separándolas por coma.
// - Construye el nodo XML con elementos hijos anidados para autor, titulo, descripcion, etc.,
//   pasando cada texto por escaparXML para garantizar que el documento sea válido.
// =============================================================================
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

// =============================================================================
// SERIALIZACIÓN COMPLETA DE LA COLECCIÓN A DOCUMENTO XML
// -----------------------------------------------------------------------------
// [TP: Día 15 · Clase Teórica 18: JSON, XML y persistencia en archivo - Parte 3C]
// EXPLICACIÓN:
// Genera un documento XML completo y bien formado:
// 1. Incluye el prólogo obligatorio de procesamiento (<?xml version="1.0" encoding="UTF-8"?>).
// 2. Define un único elemento raíz envolvente (<publicaciones>).
// 3. Concatena todos los fragmentos <publicacion> generados por publicacionAXML.
// Si el arreglo viene vacío ([]), produce un <publicaciones></publicaciones> sin hijos.
// =============================================================================
export function convertirAXML(publicaciones) {
  const elementos = publicaciones.map(publicacionAXML).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<publicaciones>
${elementos}
</publicaciones>`;
}
