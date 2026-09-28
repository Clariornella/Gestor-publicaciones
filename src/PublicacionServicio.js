// =============================================================================
// SUBCLASE PUBLICACION SERVICIO: HERENCIA Y ASOCIACIÓN
// -----------------------------------------------------------------------------
// [TP: Día 3 · Práctica: Herencia: PublicacionVenta y PublicacionServicio - Parte 2]
// Especializa la clase Publicacion mediante la palabra clave extends para representar
// avisos de servicios (como clases particulares o tutorías).
// [TP: Semana 2 · Día 5: El sistema completo - Parte 2.5: Roles en las asociaciones]
// Modela la asociación con Usuario asignándole el rol específico de "cliente" (quien contrata/reserva).
// [TP: Día 14 · Clase Teórica 17: Repositorios y operaciones CRUD - Parte 1]
// Permite recibir el 'id' al inicio para mantener compatibilidad con la identidad del repositorio.
// =============================================================================

import Publicacion from "./Publicacion.js";

export class PublicacionServicio extends Publicacion {
  // ===========================================================================
  // CONSTRUCTOR POLIMÓRFICO Y REENVÍO CON SUPER()
  // ---------------------------------------------------------------------------
  // [TP: Día 3 · Práctica - Parte 2]
  // Invoca a super() como primera instrucción obligatoria antes de acceder a this,
  // reutilizando el constructor y las validaciones de la superclase Publicacion.
  // [TP: Día 14 · Clase Teórica 17 - Parte 1]
  // Mediante arguments.length detecta si se está pasando el 'id' (7 argumentos)
  // o si se invoca con la firma tradicional local sin id (6 argumentos).
  // ===========================================================================
  constructor(
    idOTitulo,
    tituloODescripcion,
    descripcionOAutor,
    autorOModalidad,
    modalidadODuracion,
    duracionConId,
    cliente,
  ) {
    const usaId = arguments.length >= 7;
    const id = usaId ? idOTitulo : undefined;
    const titulo = usaId ? tituloODescripcion : idOTitulo;
    const descripcion = usaId ? descripcionOAutor : tituloODescripcion;
    const autor = usaId ? autorOModalidad : descripcionOAutor;
    const modalidad = usaId ? modalidadODuracion : autorOModalidad;
    const duracionMinutos = usaId ? duracionConId : modalidadODuracion;

    if (usaId) {
      super(id, autor, titulo, descripcion);
    } else {
      super(autor, titulo, descripcion);
    }

    // Atributos propios de la especialización
    this.modalidad = modalidad;
    this.duracionMinutos = duracionMinutos;

    // Rol de asociación específico: representa al usuario que reserva/solicita el servicio
    this.cliente = cliente;
  }

  // ===========================================================================
  // SOBREESCRITURA POLIMÓRFICA (OVERRIDE)
  // ---------------------------------------------------------------------------
  // [TP: Día 4 · Práctica: Polimorfismo: cada Publicacion responde a su manera - Parte 2]
  // [TP: Semanas 1-2 · Clases 3, 4 y 5 - Bloque C: Sobreescritura y polimorfismo]
  // EXPLICACIÓN:
  // - Reutiliza la lógica de la superclase mediante super.mostrarResumen() para no
  //   duplicar la generación del texto base ("titulo - descripcion (por autor)").
  // - Concatena los datos propios del servicio (modalidad y duración) y opcionalmente
  //   la información del cliente si existe.
  // - Permite recorrer colecciones heterogéneas sin necesidad de consultar tipos
  //   con if ni con instanceof (vinculación dinámica).
  // ===========================================================================
  mostrarResumen() {
    const base = super.mostrarResumen();
    const clienteInfo = this.cliente ? `, Cliente: ${this.cliente}` : "";
    return `${base} (${this.modalidad}, ${this.duracionMinutos}min)`;
  }
}

export default PublicacionServicio;
