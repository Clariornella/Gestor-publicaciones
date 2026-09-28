// =============================================================================
// ENTIDAD DE DOMINIO: USUARIO
// -----------------------------------------------------------------------------
// [TP: Semana 1 · Día 2 · Práctica: Asociando Publicación con Usuario - Parte 1]
// [TP: Semana 2 · Día 5: El sistema completo - Parte 2.5: Roles en las asociaciones]
// EXPLICACIÓN:
// Modela la entidad Usuario dentro de la aplicación, separando sus responsabilidades
// del resto de los componentes del sistema (cohesión y responsabilidad única).
// - nombre: Almacena la identificación del usuario.
// - email: Dirección de correo electrónico.
// - fechaRegistro: Marca temporal asignada automáticamente al instanciar mediante new Date().
// - contactos: Arreglo inicializado vacío que almacena instancias de otros usuarios.
//   Representa una auto-asociación (Usuario 1 — * Usuario), donde la clase se vincula
//   con objetos de su propio tipo para modelar una red de contactos.
// =============================================================================

export default class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
    this.fechaRegistro = new Date();
    this.contactos = [];
  }

  // ===========================================================================
  // PRESENTACIÓN DEL PERFIL DEL USUARIO
  // ---------------------------------------------------------------------------
  // [TP: Semana 1 · Día 2 · Práctica - Parte 1: Paso 3]
  // EXPLICACIÓN:
  // Retorna una cadena de texto combinando las propiedades esenciales del perfil
  // sin exponer la lógica interna de la clase a componentes externos.
  // ===========================================================================
  mostrarPerfil() {
    return `Nombre: ${this.nombre}, Email: ${this.email}`;
  }

  // ===========================================================================
  // GESTIÓN DE AUTO-ASOCIACIÓN (CONTACTOS)
  // ---------------------------------------------------------------------------
  // [TP: Semana 2 · Día 5 - Parte 2.5: Roles en las asociaciones]
  // EXPLICACIÓN:
  // Agrega otro objeto Usuario a la colección this.contactos mediante push().
  // Constituye una asociación estructural permanente en el objeto y no una mera
  // dependencia temporal.
  // ===========================================================================
  agregarContacto(otroUsuario) {
    this.contactos.push(otroUsuario);
  }
}
