import { Reporte } from "./Reporte.js";

export class Publicacion {
  constructor(titulo, descripcion, autor) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.autor = autor;
    this.fechaPublicacion = new Date();
    this.activa = true;
    this.destacado = false;
    this.etiquetas = [];
    this.reportes = [];
    this.estado = "pendiente";
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

  reportar(usuario, motivo) {
    const yaReporto = this.reportes.some((r) => r.usuario === usuario);
    if (yaReporto) {
      throw new Error("El usuario ya reportó esta publicación");
    }
    this.reportes.push(new Reporte(usuario, motivo));
  }

  requiereRevision() {
    return this.reportes.length >= 3;
  }
  eportar(usuario, motivo) {
    const yaReporto = this.reportes.some((r) => r.usuario === usuario);
    if (yaReporto) {
      throw new Error("El usuario ya reportó esta publicación");
    }
    this.reportes.push(new Reporte(usuario, motivo));
  }
  requiereRevision() {
    return this.reportes.length >= 3;
  }
  async revisar(servicioModeracion) {
    const decision = await servicioModeracion.evaluar(this);
    if (decision === "aprobado") {
      this.estado = "aprobada";
    } else if (decision === "rechazado") {
      this.estado = "rechazada";
    } else {
      throw new Error("Decisión de moderación inválida");
    }
    return this.estado;
  }
}

export default Publicacion;
