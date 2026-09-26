export class Publicacion {
  constructor(titulo, descripcion, autor) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.autor = autor;
    this.fechaPublicacion = new Date();
    this.activa = true;
    this.destacado = false;
    this.etiquetas = [];
  }

  get resumen() {
    const estadoTexto = this.activa ? "Activa" : "Inactiva";
    return `${this.autor.nombre} — ${this.titulo} (${estadoTexto})`;
  }

  destacar() {
    this.destacado = true;
  }

  opacar() {
    this.destacado = false;
  }

  mostrarResumen() {
    return `${this.titulo} - ${this.autor.nombre} - (${this.autor.email})`;
  }

  estaActiva() {
    return this.activa;
  }

  darDeBaja() {
    this.activa = false;
  }

  agregarEtiqueta(etiqueta) {
    const normalizada = etiqueta.trim();
    if (!normalizada) {
      throw new Error("Etiqueta inválida");
    }
    const yaExiste = this.tieneEtiqueta(normalizada);
    if (!yaExiste) {
      this.etiquetas.push(normalizada);
    }
  }

  tieneEtiqueta(etiqueta) {
    const buscada = etiqueta.trim().toLowerCase();
    return this.etiquetas.some((e) => e.toLowerCase() === buscada);
  }
}

export default Publicacion;
