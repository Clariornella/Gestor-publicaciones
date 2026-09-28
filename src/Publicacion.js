// =============================================================================
// CATEGORÍAS PERMITIDAS DEL DOMINIO
// -----------------------------------------------------------------------------
// [TP: Día 16 · Clase 16 de Teoría: Alta de publicaciones con validación en el servidor - Parte 1]
// EXPLICACIÓN:
// Define la lista cerrada y explícita de valores permitidos para el atributo 'categoria'
// según el contrato de datos del dominio acordado entre cliente, servidor y modelo.
// =============================================================================
export const CATEGORIAS_PERMITIDAS = [
  "general",
  "aviso",
  "evento",
  "compraventa",
];

export class Publicacion {
  // ===========================================================================
  // CONSTRUCTOR POLIMÓRFICO DE SOBRECARGA Y VALIDACIÓN CONTRATADA
  // ---------------------------------------------------------------------------
  // [TP: Semana 1 · Día 1: De Node.js a la primera clase: Publicacion - Parte 2]
  // Estructura base inicial (titulo, descripcion, autor, activa).
  // [TP: Día 16 · Clase 16 de Teoría - Parte 1: El dominio valida y normaliza]
  // Implementa el ciclo estricto (convertir -> validar -> asignar) y lanza Error si falla.
  // [TP: Día 14 · Clase Teórica 17: Repositorios y operaciones CRUD - Parte 1]
  // Incorpora el soporte de identidad 'id' recibido como primer parámetro opcional.
  // EXPLICACIÓN DE ARGUMENTOS:
  // Mediante arguments.length detecta si se está invocando con o sin 'id':
  // - Firma tradicional (4 args): (autor, titulo, descripcion, categoria) -> id queda undefined.
  // - Firma con identidad (5 args): (id, autor, titulo, descripcion, categoria).
  // ===========================================================================
  constructor(
    idOAutor,
    autorOTitulo,
    tituloODescripcion,
    descripcionOCategoria = "general",
    categoriaConId = "general",
  ) {
    const usaId = arguments.length >= 5;
    const id = usaId ? idOAutor : undefined;
    const autor = usaId ? autorOTitulo : idOAutor;
    const titulo = usaId ? tituloODescripcion : autorOTitulo;
    const descripcion = usaId ? descripcionOCategoria : tituloODescripcion;
    const categoria = usaId ? categoriaConId : descripcionOCategoria;

    // -------------------------------------------------------------------------
    // VALIDACIONES DEL DOMINIO (Convertir -> Validar -> Asignar)
    // -------------------------------------------------------------------------
    // 1. Autor: Obligatorio, no puede ser vacío ni contener únicamente espacios en blanco.
    if (!autor?.trim()) {
      throw new Error("El autor es obligatorio");
    }

    // 2. Título: Normaliza espacios y valida longitud estricta entre 5 y 80 caracteres.
    const tituloNormalizado = titulo?.trim() ?? "";
    if (tituloNormalizado.length < 5 || tituloNormalizado.length > 80) {
      throw new Error("El título debe tener entre 5 y 80 caracteres");
    }

    // 3. Descripción: Normaliza espacios y valida longitud entre 20 y 500 caracteres.
    const descripcionNormalizado = descripcion?.trim() ?? "";
    if (
      descripcionNormalizado.length < 20 ||
      descripcionNormalizado.length > 500
    ) {
      throw new Error("La descripcion debe tener entre 20 y 500 caracteres");
    }

    // 4. Categoría: Comprueba que pertenezca a la lista CATEGORIAS_PERMITIDAS.
    if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
      throw new Error(
        `La categoría debe ser una de: ${CATEGORIAS_PERMITIDAS.join(", ")}`,
      );
    }

    // -------------------------------------------------------------------------
    // ASIGNACIÓN DE ESTADO INICIAL
    // -------------------------------------------------------------------------
    this.id = id;
    this.autor = autor.trim();
    this.titulo = tituloNormalizado;
    this.descripcion = descripcionNormalizado;
    this.categoria = categoria;
    this.activa = true;

    // =========================================================================
    // COLECCIONES Y ESTADOS DE MODERACIÓN
    // -------------------------------------------------------------------------
    // [TP: Semana 4 · Día 12: Etiquetas y testing unitario - Parte 1] (etiquetas)
    // [TP: Día 10 · Clases 13 y 14 de Teoría: Reportes y notificaciones - Partes 2 y 6]
    // Inicializa la lista de reportes, el Set de control de duplicados y el estado de revisión.
    // =========================================================================
    this.etiquetas = [];
    this.reportes = [];
    this.usuariosReportaron = new Set();
    this.estado = "pendiente";
  }

  // ===========================================================================
  // MÉTODOS DE ETIQUETAS Y ESTADO ACTIVO
  // ---------------------------------------------------------------------------
  // [TP: Semana 4 · Día 12: Etiquetas y testing unitario - Partes 1 y 4]
  // [TP: Día 8 · Práctica: El gestor llega al navegador - Parte 7] (darDeBaja)
  // EXPLICACIÓN:
  // - agregarEtiqueta: Limpia espacios, pasa a minúsculas y evita duplicados en this.etiquetas.
  // - tieneEtiqueta: Comprueba pertenencia de forma insensible a mayúsculas/minúsculas.
  // - darDeBaja: Transiciona la publicación a inactiva sin eliminarla de la memoria.
  // - mostrarResumen: Provee una representación textual legible de la instancia.
  // ===========================================================================
  agregarEtiqueta(etiqueta) {
    const normalizada = etiqueta?.trim().toLowerCase();
    if (!normalizada) {
      throw new Error("Etiqueta inválida");
    }
    if (!this.etiquetas.includes(normalizada)) {
      this.etiquetas.push(normalizada);
    }
  }

  tieneEtiqueta(etiqueta) {
    const normalizada = etiqueta?.trim().toLowerCase();
    return this.etiquetas.includes(normalizada);
  }

  darDeBaja() {
    this.activa = false;
  }

  mostrarResumen() {
    return `${this.titulo} - ${this.descripcion} (por ${this.autor})`;
  }

  // ===========================================================================
  // MÉTODOS DE MODERACIÓN Y REPORTES
  // ---------------------------------------------------------------------------
  // [TP: Día 10 · Clases 13 y 14 de Teoría - Parte 2: Publicaciones reportables]
  // EXPLICACIÓN:
  // - reportar: Garantiza que un mismo usuario no reporte dos veces la misma publicación
  //   utilizando this.usuariosReportaron (Set), y acumula el motivo en this.reportes.
  // - requiereRevision: Determina si se alcanzó el umbral de moderación (mínimo 3 reportes).
  // ===========================================================================
  reportar(usuario, motivo) {
    if (this.usuariosReportaron.has(usuario)) {
      throw new Error("El usuario ya reportó esta publicación");
    }
    this.usuariosReportaron.add(usuario);
    this.reportes.push({ usuario, motivo });
  }

  requiereRevision() {
    return this.reportes.length >= 3;
  }

  // ===========================================================================
  // REVISIÓN ASINCRÓNICA CON SERVICIO DE MODERACIÓN EXTERNO
  // ---------------------------------------------------------------------------
  // [TP: Día 10 · Clases 13 y 14 de Teoría - Parte 6: Revisión asíncrona]
  // EXPLICACIÓN:
  // Delega la evaluación en un colaborador externo (servicio.evaluar(this)).
  // Si resuelve "aprobado" o "rechazado", actualiza this.estado.
  // Si la promesa es rechazada (error de red o timeout), el bloque catch propaga
  // la excepción manteniendo intacto el estado inicial "pendiente".
  // ===========================================================================
  async revisar(servicio) {
    try {
      const resultado = await servicio.evaluar(this);
      if (resultado === "aprobado") {
        this.estado = "aprobada";
      } else if (resultado === "rechazado") {
        this.estado = "rechazada";
      }
      return this.estado;
    } catch (error) {
      // Conserva el estado original "pendiente" y propaga el error
      throw error;
    }
  }
}

// Export default para compatibilidad con suites que usan import Publicacion from ...
export default Publicacion;
