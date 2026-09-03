// Caso A
// Tipo: asociacion
// El objeto cliente se guarda como un atributo permanente en la instancia mediante this.cliente = cliente dentro del constructor. El vínculo persiste en el tiempo a lo largo de todo el ciclo de vida del objeto Factura y no es un uso transitorio.
class Factura {
 constructor(numero, cliente) {
 this.numero = numero;
 this.cliente = cliente; // objeto Cliente
 }
}


// Caso B
// Tipo: dependencia
// El objeto calculadora no se guarda como atributo (no se asigna a this). Se recibe únicamente como parámetro del método aplicarImpuesto y se usa de manera puntual; una vez terminada la ejecución del método, la referencia se pierde y el vínculo no persiste en el tiempo.
class Factura {
 aplicarImpuesto(calculadora) {
 return calculadora.calcular(this.total);
 }
}


// Caso C
// Tipo: asociacion
// El arreglo de libros se guarda estructuralmente como un atributo de la instancia (this.libros = []). Las referencias a los objetos Libro permanecen almacenadas en memoria dentro del objeto Biblioteca a lo largo del tiempo, en lugar de ser un parámetro que se use una sola vez y se descarte.
class Biblioteca {
 constructor() {
 this.libros = []; // array de objetos Libro
 }
}