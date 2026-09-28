// =============================================================================
// ENTIDAD DE DOMINIO: REPORTE
// -----------------------------------------------------------------------------
// [TP: Día 10 · Clases 13 y 14 de Teoría: Etiquetas en revisión: reportes y notificaciones - Parte 1]
// EXPLICACIÓN:
// Modela un reporte individual de moderación realizado por un usuario sobre una publicación.
// - Regla de validación: el motivo no puede ser una cadena vacía ni contener solo espacios en blanco.
//   Si no cumple la condición, interrumpe la instanciación lanzando Error("Motivo inválido").
// - Atributos:
//   * usuario: Identifica quién emite el reporte (clave para la regla de duplicados).
//   * motivo: Almacena la razón normalizada sin espacios iniciales ni finales (.trim()).
//   * fecha: Registra la marca temporal exacta del reporte mediante new Date().
// Esta entidad colabora directamente con Publicacion.reportar(usuario, motivo)
// para determinar si la publicación alcanza el umbral de revisión (3 reportes).
// =============================================================================

export class Reporte {
  constructor(usuario, motivo) {
    const normalizado = motivo.trim();
    if (!normalizado) {
      throw new Error("Motivo inválido");
    }
    this.usuario = usuario;
    this.motivo = normalizado;
    this.fecha = new Date();
  }
}
