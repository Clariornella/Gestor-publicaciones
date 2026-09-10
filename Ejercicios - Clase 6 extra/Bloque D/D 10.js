class Empleado {
  constructor(nombre, sueldoBase) {
    this.nombre = nombre;
    this.sueldoBase = sueldoBase;
  }

  calcularSueldo() {
    return this.sueldoBase;
  }
}

class EmpleadoTiempoCompleto extends Empleado {
  calcularSueldo() {
    const base = super.calcularSueldo();
    return base + 50000;
  }
}

class EmpleadoFreelance extends Empleado {
  constructor(nombre, sueldoBase, horasTrabajadas, valorHora) {
    super(nombre, sueldoBase);
    this.horasTrabajadas = horasTrabajadas;
    this.valorHora = valorHora;
  }

  calcularSueldo() {
    // No usa super.calcularSueldo(): sueldoBase no aplica aca.
    return this.horasTrabajadas * this.valorHora;
  }
}

const empleados = [
  new Empleado("Ana", 300000),
  new EmpleadoTiempoCompleto("Bruno", 300000),
  new EmpleadoFreelance("Carla", 0, 40, 5000),
];

empleados.forEach((e) => {
  console.log(`${e.nombre}: $${e.calcularSueldo()}`);
});
