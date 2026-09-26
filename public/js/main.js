import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "../../src/RepositorioPublicaciones.js";
import Publicacion from "../../src/Publicacion.js";

const titulo = document.querySelector("#titulo");
const autor = document.querySelector("#autor");
const tipo = document.querySelector("#tipo");
const vistaPrevia = document.querySelector("#vista-previa");
const camposEspecificos = document.querySelector("#campos-especificos");
const email = document.querySelector("#email");
const ayudaEmail = document.querySelector("#ayuda-email");
const formulario = document.querySelector("#form-publicacion");
const descripcion = document.querySelector("#descripcion");
const listaPublicaciones = document.querySelector("#lista-publicaciones");
const estado = document.querySelector("#estado");
const botonActualizar = document.querySelector("#btn-actualizar");
const botonError = document.querySelector("#btn-error");
const errorTitulo = document.querySelector("#error-titulo");
const errorAutor = document.querySelector("#error-autor");
const contador = document.querySelector("#contador");
const enviar =
  document.querySelector("#form-publicacion button[type='submit']") ||
  document.querySelector("#btn-publicar");

// Instancia del repositorio
const repositorio = new RepositorioPublicaciones();

// Vista previa
function actualizarVistaPrevia() {
  if (contador) {
    contador.textContent = descripcion.value.length;
  }
  vistaPrevia.textContent =
    `${titulo.value || "Sin título"} — ` +
    `${autor.value || "..."} (${tipo.value})`;
}

[titulo, autor, descripcion, tipo].forEach((control) => {
  if (control) {
    control.addEventListener("input", actualizarVistaPrevia);
  }
});

actualizarVistaPrevia();

titulo.addEventListener("input", actualizarVistaPrevia);
autor.addEventListener("input", actualizarVistaPrevia);
tipo.addEventListener("change", actualizarVistaPrevia);
actualizarVistaPrevia();

// Campos específicos según tipo
function actualizarCamposEspecificos() {
  if (tipo.value === "venta") {
    camposEspecificos.innerHTML = `
      <div>
        <label for="precio">Precio:</label>
        <input id="precio" type="number" placeholder="Precio" required>
        <span id="error-precio" class="error"></span>
      </div>
    `;
    const inputPrecio = document.querySelector("#precio");
    inputPrecio.addEventListener("input", () => validarPrecio(false));
    inputPrecio.addEventListener("blur", () => validarPrecio(true));
  } else {
    camposEspecificos.innerHTML = `
      <div>
        <label for="modalidad">Modalidad:</label>
        <select id="modalidad">
          <option value="presencial">Presencial</option>
          <option value="remoto">Remoto</option>
        </select>
      </div>
      <br>
      <div>
        <label for="duracion">Duración (minutos):</label>
        <input id="duracion" type="number" placeholder="Duración" required>
      </div>
    `;
  }

  // Reevalúa si el formulario queda habilitado o deshabilitado al cambiar de tipo
  actualizarEstadoFormulario();
}

// Llamada inicial al arrancar el script para que el botón comience deshabilitado
actualizarEstadoFormulario();
tipo.addEventListener("change", actualizarCamposEspecificos);
actualizarCamposEspecificos();

// Ayuda email
email.addEventListener("focus", () => {
  ayudaEmail.textContent = "Usá un email válido del autor";
});
email.addEventListener("blur", () => {
  ayudaEmail.textContent = "";
});

// Creación del objeto de dominio
function crearPublicacionDesdeFormulario() {
  const usuario = new Usuario(autor.value, email.value);
  if (tipo.value === "venta") {
    return new PublicacionVenta(
      titulo.value,
      descripcion.value,
      usuario,
      Number(document.querySelector("#precio").value),
    );
  }
  return new PublicacionServicio(
    titulo.value,
    descripcion.value,
    usuario,
    document.querySelector("#modalidad").value,
    Number(document.querySelector("#duracion").value),
  );
}

// Parte 2: Renderizar publicaciones con data-id y data-accion
function renderizarPublicaciones() {
  listaPublicaciones.innerHTML = "";

  repositorio.publicaciones.forEach((pub, index) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");
    tarjeta.dataset.id = index; // data-id en la tarjeta

    const parrafoResumen = document.createElement("p");
    parrafoResumen.textContent = pub.mostrarResumen();

    const parrafoEstado = document.createElement("p");
    parrafoEstado.innerHTML = `<strong>Estado:</strong> <span class="estado">${pub.estaActiva() ? "Activa" : "Inactiva"}</span>`;

    const parrafoDestacado = document.createElement("p");
    parrafoDestacado.innerHTML = `<strong>Destacado:</strong> <span class="destacado">${pub.destacado ? "Sí" : "No"}</span>`;

    // Botón Destacar con data-accion="destacar"
    const botonDestacar = document.createElement("button");
    botonDestacar.type = "button";
    botonDestacar.textContent = "Destacar";
    botonDestacar.dataset.accion = "destacar";

    // Botón Dar de baja con data-accion="baja"
    const botonBaja = document.createElement("button");
    botonBaja.type = "button";
    botonBaja.textContent = "Dar de baja";
    botonBaja.dataset.accion = "baja";

    tarjeta.appendChild(parrafoResumen);
    tarjeta.appendChild(parrafoEstado);
    tarjeta.appendChild(parrafoDestacado);
    tarjeta.appendChild(botonDestacar);
    tarjeta.appendChild(botonBaja);

    listaPublicaciones.appendChild(tarjeta);
  });
}

// Manejo del formulario
async function manejarEnvio(evento) {
  evento.preventDefault();

  // Validación final antes de procesar
  if (!validarTitulo(true) || !validarAutor(true) || !validarPrecio(true)) {
    return;
  }

  // Estado: Cargando / Procesando
  enviar.disabled = true;
  estado.textContent = "Publicando...";

  try {
    // Simula la demora del servidor (800 ms)
    await esperar(800);

    const publicacion = crearPublicacionDesdeFormulario();
    repositorio.agregar(publicacion);
    renderizarPublicaciones();

    // Estado: Éxito
    estado.textContent = "Publicación agregada";

    formulario.reset();
    actualizarCamposEspecificos();
    actualizarVistaPrevia();
  } catch (error) {
    // Estado: Error
    estado.textContent = `Error: ${error.message}`;
  } finally {
    // Garantiza que el botón recupere el estado correcto según el formulario limpio o con datos
    actualizarEstadoFormulario();
  }
}

formulario.addEventListener("submit", manejarEnvio);

function manejarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !listaPublicaciones.contains(boton)) return;

  const tarjeta = boton.closest("[data-id]");
  const id = Number(tarjeta.dataset.id);

  const accion = boton.dataset.accion;

  const publicacion = repositorio.publicaciones[id];
  if (!publicacion) return;

  if (accion === "baja") publicacion.darDeBaja();
  if (accion === "destacar") publicacion.destacar();

  renderizarPublicaciones();
}
listaPublicaciones.addEventListener("click", manejarAccion);

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

console.log("Esperando 2 segundos...");
esperar(2000).then(() => {
  console.log("2 segundos han pasado.");
});

// Carga asíncrona con manejo de estados y recuperación de errores
async function cargarPublicaciones(forzarError = false) {
  estado.textContent = "Cargando publicaciones...";
  botonActualizar.disabled = true;

  try {
    const url = forzarError
      ? "/api/publicaciones?error=1"
      : "/api/publicaciones";
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error("La respuesta no fue exitosa");
    }

    const datos = await respuesta.json();
    repositorio.cargarDesde(datos);
    renderizarPublicaciones();
    estado.textContent = `${datos.length} publicaciones recibidas`;
  } catch (error) {
    estado.textContent = `Error: ${error.message}`;
  } finally {
    botonActualizar.disabled = false;
  }
}

// Listeners de actualización y prueba de error
botonActualizar.addEventListener("click", () => cargarPublicaciones(false));
if (botonError) {
  botonError.addEventListener("click", () => cargarPublicaciones(true));
}

// --- Validaciones con input y blur ---

function validarTitulo(mostrarError = true) {
  const valido = titulo.value.trim().length >= 5;
  titulo.classList.toggle("valido", valido);
  titulo.classList.toggle("invalido", !valido && mostrarError);
  if (errorTitulo) {
    errorTitulo.textContent =
      !valido && mostrarError ? "Ingrese al menos 5 caracteres" : "";
  }
  return valido;
}

titulo.addEventListener("input", () => validarTitulo(false));
titulo.addEventListener("blur", () => validarTitulo(true));

// Validación de Autor (mínimo 3 caracteres)
function validarAutor(mostrarError = true) {
  const valido = autor.value.trim().length >= 3;
  autor.classList.toggle("valido", valido);
  autor.classList.toggle("invalido", !valido && mostrarError);
  if (errorAutor) {
    errorAutor.textContent =
      !valido && mostrarError ? "Ingrese al menos 3 caracteres" : "";
  }
  return valido;
}

autor.addEventListener("input", () => validarAutor(false));
autor.addEventListener("blur", () => validarAutor(true));

// Validación de Precio (mayor a 0 si es tipo 'venta')
function validarPrecio(mostrarError = true) {
  if (tipo.value !== "venta") return true;

  const inputPrecio = document.querySelector("#precio");
  const errorPrecio = document.querySelector("#error-precio");
  if (!inputPrecio) return true;

  const valido = Number(inputPrecio.value) > 0;
  inputPrecio.classList.toggle("valido", valido);
  inputPrecio.classList.toggle("invalido", !valido && mostrarError);
  if (errorPrecio) {
    errorPrecio.textContent =
      !valido && mostrarError ? "El precio debe ser mayor a 0" : "";
  }
  return valido;
}

function formularioValido() {
  const precioInput = document.querySelector("#precio");
  const precioValido =
    tipo.value !== "venta" || (precioInput && Number(precioInput.value) > 0);

  return (
    titulo.value.trim().length >= 5 &&
    autor.value.trim().length >= 3 &&
    precioValido
  );
}

function actualizarEstadoFormulario() {
  if (enviar) {
    enviar.disabled = !formularioValido();
  }
}

formulario.addEventListener("input", actualizarEstadoFormulario);
