// =============================================================================
// SUBCLASE PUBLICACION VENTA: HERENCIA Y ESPECIALIZACIÓN
// -----------------------------------------------------------------------------
// [TP: Día 3 · Práctica: Herencia: PublicacionVenta y PublicacionServicio - Parte 1]
// Extiende la clase base Publicacion con extends para representar avisos de venta
// de apuntes, libros o materiales dentro de la comunidad.
// [TP: Día 14 · Clase Teórica 17: Repositorios y operaciones CRUD - Parte 1]
// Adapta la firma para aceptar el 'id' al inicio (identidad asignada por la colección).
// =============================================================================

import Publicacion from "./Publicacion.js";

export class PublicacionVenta extends Publicacion {
  // ===========================================================================
  // CONSTRUCTOR POLIMÓRFICO Y LLAMADA A SUPER()
  // ---------------------------------------------------------------------------
  // [TP: Día 3 · Práctica - Parte 1: super() primero]
  // La llamada a super(...) debe ejecutarse en la primera línea antes de usar this;
  // de lo contrario, el motor de JavaScript arroja una excepción de referencia.
  // [TP: Día 14 · Clase Teórica 17 - Parte 1]
  // Mediante arguments.length distingue si se instancia desde el repositorio
  // con identidad (6 o más argumentos: id, autor, titulo, descripcion, categoria, precio)
  // o desde la versión tradicional en memoria (idOTitulo, autorODescripcion, etc.).
  // [TP: Día 3 · Práctica - Parte 1, Paso 3]
  // Inicializa atributos propios de la venta: precio numérico y stock fijado en 1.
  // ===========================================================================
  constructor(
    idOTitulo,
    autorODescripcion,
    tituloOAutor,
    descripcionOPrecio,
    categoriaOPrecio,
    precioConId,
  ) {
    const usaId = arguments.length >= 6;
    const id = usaId ? idOTitulo : undefined;
    const autor = usaId ? autorODescripcion : tituloOAutor;
    const titulo = usaId ? tituloOAutor : idOTitulo;
    const descripcion = usaId ? descripcionOPrecio : autorODescripcion;
    const categoria = usaId ? categoriaOPrecio : "general";
    const precio = usaId ? precioConId : descripcionOPrecio;

    if (usaId) {
      super(id, autor, titulo, descripcion, categoria);
    } else {
      super(autor, titulo, descripcion, categoria);
    }
    this.precio = precio;
    this.stock = 1;
  }

  // ===========================================================================
  // SOBREESCRITURA POLIMÓRFICA (OVERRIDE)
  // ---------------------------------------------------------------------------
  // [TP: Día 4 · Práctica: Polimorfismo: cada Publicacion responde a su manera - Parte 1]
  // [TP: Semanas 1-2 · Clases 3, 4 y 5 - Bloque C: Sobreescritura y polimorfismo]
  // EXPLICACIÓN:
  // - Evita duplicar lógica reutilizando la implementación de la superclase
  //   mediante super.mostrarResumen().
  // - Concatena el precio específico de la venta formateado al final (-$precio).
  // - Permite que colecciones mixtas de publicaciones muestren su resumen propio
  //   sin usar condicionales if ni comprobar tipos con instanceof.
  // ===========================================================================
  mostrarResumen() {
    const base = super.mostrarResumen();
    return `${base} -$${this.precio}`;
  }
}

export default PublicacionVenta;
