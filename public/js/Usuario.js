export default class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
    this.fechaRegistro = new Date();
    this.contactos = [];
  }

  mostrarPerfil() {
    return `Nombre: ${this.nombre}, Email: ${this.email}`;
  }

  agregarContacto(otroUsuario) {
    this.contactos.push(otroUsuario);
  }
}
