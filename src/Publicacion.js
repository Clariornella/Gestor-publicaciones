export const CATEGORIAS_PERMITIDAS = [
  "general",
  "aviso",
  "evento",
  "compraventa",
];

export class Publicacion {
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

    // 1. Autor
    if (!autor?.trim()) {
      throw new Error("El autor es obligatorio");
    }

    // 2. Título (convertir -> validar)
    const tituloNormalizado = titulo?.trim() ?? "";
    if (tituloNormalizado.length < 5 || tituloNormalizado.length > 80) {
      throw new Error("El título debe tener entre 5 y 80 caracteres");
    }

    // 3. Descripción (convertir -> validar)
    const descripcionNormalizado = descripcion?.trim() ?? "";
    if (
      descripcionNormalizado.length < 20 ||
      descripcionNormalizado.length > 500
    ) {
      throw new Error("La descripcion debe tener entre 20 y 500 caracteres");
    }

    // 4. Categoría
    if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
      throw new Error(
        `La categoría debe ser una de: ${CATEGORIAS_PERMITIDAS.join(", ")}`,
      );
    }

    // Asignación de propiedades validadas
    this.id = id;
    this.autor = autor.trim();
    this.titulo = tituloNormalizado;
    this.descripcion = descripcionNormalizado;
    this.categoria = categoria;
    this.activa = true;

    // Propiedades acumuladas de clases anteriores (etiquetas, reportes, asincronía)
    this.etiquetas = [];
    this.reportes = [];
    this.usuariosReportaron = new Set();
    this.estado = "pendiente";
  }

  // --- MÉTODOS DE ETIQUETAS Y ESTADO ---
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

  // --- MÉTODOS DE REPORTES (PARTE 2) ---
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

  // --- MÉTODO ASINCRÓNICO DE REVISIÓN ---
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
