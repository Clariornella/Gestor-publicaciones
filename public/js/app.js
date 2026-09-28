// =============================================================================
// CAPTURA DE ELEMENTOS DEL DOM
// -----------------------------------------------------------------------------
// [TP: Día 8 - Práctica: El gestor llega al navegador]
// Centraliza las referencias a los nodos del HTML mediante querySelector para no
// consultar el árbol del DOM reiteradamente en cada interacción.
// =============================================================================
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

// [TP: Días 10-11 - Práctica: Asincronía y formularios reactivos]
// Elementos para disparar acciones de carga asíncrona, control de errores y validación en tiempo real.
const botonActualizar = document.querySelector("#btn-actualizar");
const botonError = document.querySelector("#btn-error");
const errorTitulo = document.querySelector("#error-titulo");
const errorAutor = document.querySelector("#error-autor");
const contador = document.querySelector("#contador");
const enviar =
  document.querySelector("#form-publicacion button[type='submit']") ||
  document.querySelector("#btn-publicar");

// [TP: Día 12 - Clase 15: Cliente, servidor y dominio]
// Consulta de estado simple hacia el servidor Node/Express.
const botonConsultar = document.querySelector("#consultar");
const parrafoEstado = document.querySelector("#estado");

// [TP: Día 16 - Clase 16: Alta de publicaciones con validación en el servidor]
// Formulario secundario para envío y visualización de confirmación/error.
const formularioPedido = document.querySelector("#pedido");
const salida = document.querySelector("#salida");

// [TP: Día 15 - Clase 18: JSON, XML y persistencia en archivo]
// Elementos para diagnóstico y visualización de formatos estructurados de datos.
const botonVerJSON = document.querySelector("#ver-json");
const botonVerXML = document.querySelector("#ver-xml");
const diagnosticoCrudo = document.querySelector("#diagnostico-crudo");
const diagnosticoLista = document.querySelector("#diagnostico-lista");

// =============================================================================
// VISTA PREVIA INCREMENTAL
// -----------------------------------------------------------------------------
// [TP: Día 8 - Parte 3] y [TP: Días 10-11 - Parte 5]
// Actualiza la vista previa del aviso y el contador de caracteres en tiempo real
// mientras el usuario tipea ('input') o cambia de opción ('change'), sin instanciar
// aún la clase del dominio.
// =============================================================================
function actualizarVistaPrevia() {
  if (contador) {
    contador.textContent = descripcion.value.length;
  }
  if (vistaPrevia) {
    vistaPrevia.textContent =
      `${titulo.value || "Sin título"} — ` +
      `${autor.value || "..."} (${tipo.value})`;
  }
}

[titulo, autor, descripcion, tipo].forEach((control) => {
  if (control) {
    control.addEventListener("input", actualizarVistaPrevia);
  }
});

if (tipo) {
  tipo.addEventListener("change", actualizarVistaPrevia);
}
actualizarVistaPrevia();

// =============================================================================
// MODIFICACIÓN DINÁMICA DE CAMPOS SEGÚN TIPO
// -----------------------------------------------------------------------------
// [TP: Día 8 - Parte 4: Change adapta el formulario]
// Según la selección del <select id="tipo">, inyecta en el contenedor HTML los
// campos específicos requeridos: "precio" para venta o "modalidad/duración" para servicio.
// Al crearse el input dinámicamente, le enlaza sus validadores de evento 'input' y 'blur'.
// =============================================================================
function actualizarCamposEspecificos() {
  if (!camposEspecificos || !tipo) return;

  if (tipo.value === "venta") {
    camposEspecificos.innerHTML = `
      <div>
        <label for="precio">Precio:</label>
        <input id="precio" type="number" placeholder="Precio" required>
        <span id="error-precio" class="error"></span>
      </div>
    `;
    const inputPrecio = document.querySelector("#precio");
    if (inputPrecio) {
      inputPrecio.addEventListener("input", () => validarPrecio(false));
      inputPrecio.addEventListener("blur", () => validarPrecio(true));
    }
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

  actualizarEstadoFormulario();
}

actualizarEstadoFormulario();
if (tipo) {
  tipo.addEventListener("change", actualizarCamposEspecificos);
  actualizarCamposEspecificos();
}

// =============================================================================
// AYUDA CONTEXTUAL PARA INPUTS
// -----------------------------------------------------------------------------
// [TP: Día 8 - Parte 5: Focus y blur ofrecen ayuda]
// Modifica la interfaz mostrando instrucciones visuales cuando el usuario entra
// ('focus') al campo y retirándolas cuando sale ('blur').
// =============================================================================
if (email && ayudaEmail) {
  email.addEventListener("focus", () => {
    ayudaEmail.textContent = "Usá un email válido del autor";
  });
  email.addEventListener("blur", () => {
    ayudaEmail.textContent = "";
  });
}

// =============================================================================
// DOMINIO LOCAL: CREACIÓN Y RENDERIZADO
// -----------------------------------------------------------------------------
// [TP: Día 8 - Parte 6] y [TP: Día 9 - Práctica: Eventos sobre publicaciones dinámicas]
// Instanciación polimórfica en el cliente (PublicacionVenta / PublicacionServicio) y
// renderizado dentro de <article> con atributos personalizados (dataset) data-id y data-accion.
// =============================================================================
function crearPublicacionDesdeFormulario() {
  const usuario = new Usuario(autor.value, email ? email.value : "");
  if (tipo.value === "venta") {
    const inputPrecio = document.querySelector("#precio");
    return new PublicacionVenta(
      titulo.value,
      descripcion.value,
      usuario,
      inputPrecio ? Number(inputPrecio.value) : 0,
    );
  }
  const modalidadInput = document.querySelector("#modalidad");
  const duracionInput = document.querySelector("#duracion");
  return new PublicacionServicio(
    titulo.value,
    descripcion.value,
    usuario,
    modalidadInput ? modalidadInput.value : "presencial",
    duracionInput ? Number(duracionInput.value) : 0,
  );
}

function renderizarPublicaciones() {
  if (!listaPublicaciones || typeof repositorio === "undefined") return;
  listaPublicaciones.innerHTML = "";

  repositorio.publicaciones.forEach((pub, index) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");
    tarjeta.dataset.id = index;

    const parrafoResumen = document.createElement("p");
    parrafoResumen.textContent = pub.mostrarResumen();

    const parrafoEst = document.createElement("p");
    parrafoEst.innerHTML = `<strong>Estado:</strong> <span class="estado">${pub.estaActiva() ? "Activa" : "Inactiva"}</span>`;

    const parrafoDestacado = document.createElement("p");
    parrafoDestacado.innerHTML = `<strong>Destacado:</strong> <span class="destacado">${pub.destacado ? "Sí" : "No"}</span>`;

    const botonDestacar = document.createElement("button");
    botonDestacar.type = "button";
    botonDestacar.textContent = "Destacar";
    botonDestacar.dataset.accion = "destacar";

    const botonBaja = document.createElement("button");
    botonBaja.type = "button";
    botonBaja.textContent = "Dar de baja";
    botonBaja.dataset.accion = "baja";

    tarjeta.appendChild(parrafoResumen);
    tarjeta.appendChild(parrafoEst);
    tarjeta.appendChild(parrafoDestacado);
    tarjeta.appendChild(botonDestacar);
    tarjeta.appendChild(botonBaja);

    listaPublicaciones.appendChild(tarjeta);
  });
}

// =============================================================================
// FUNCIÓN AUXILIAR DE ESPERA
// -----------------------------------------------------------------------------
// [TP: Días 10-11 - Parte 1: Simulamos un servidor que tarda en responder]
// Envuelve un setTimeout en una Promesa para poder utilizar retardos artificiales con await.
// =============================================================================
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// CARGA ASÍNCRONA DESDE EL BACKEND
// -----------------------------------------------------------------------------
// [TP: Día 14 - Clase 17: Repositorios y operaciones CRUD - Paso 5D]
// Realiza una petición GET al Router de Express (/publicaciones) para obtener el JSON
// y dibuja la lista en el DOM con template literals sin recargar la página.
// =============================================================================
async function cargarPublicaciones() {
  try {
    const respuesta = await fetch("/publicaciones");
    if (!respuesta.ok) return;

    const publicaciones = await respuesta.json();

    if (listaPublicaciones) {
      listaPublicaciones.innerHTML = publicaciones
        .map(
          (pub) => `
            <li data-id="${pub.id}">
              <strong>#${pub.id}: ${pub.titulo}</strong> (por ${pub.autor})
              <p>${pub.descripcion}</p>
              <small>Categoría: ${pub.categoria}</small>
            </li>
          `,
        )
        .join("");
    }
  } catch (error) {
    console.error("Error al cargar publicaciones:", error);
  }
}

// Carga inicial al parsear el script
cargarPublicaciones();

// =============================================================================
// ENVÍO DE FORMULARIO CON FETCH Y SIN RECARGA
// -----------------------------------------------------------------------------
// [TP: Día 14 - Clase 17 - Paso 5E] y [TP: Días 10-11 - Parte 7]
// Intercepta el submit con preventDefault(), valida campos, desactiva el botón
// para evitar envíos dobles, hace un POST en JSON al backend y refresca la lista.
// =============================================================================
async function manejarEnvio(evento) {
  // Evita la navegación/recarga tradicional del navegador
  evento.preventDefault();

  if (!validarTitulo(true) || !validarAutor(true)) {
    return;
  }

  if (enviar) enviar.disabled = true;
  if (estado) estado.textContent = "Publicando...";

  const datos = {
    autor: autor.value.trim(),
    titulo: titulo.value.trim(),
    descripcion: descripcion.value.trim(),
    categoria: tipo ? tipo.value : "general",
  };

  try {
    const urlDestino = formulario.action || "/publicaciones";
    const respuesta = await fetch(urlDestino, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (respuesta.ok) {
      if (estado) estado.textContent = "Publicación agregada con éxito";
      formulario.reset();
      actualizarCamposEspecificos();
      actualizarVistaPrevia();
      await cargarPublicaciones(); // Refresca sin recargar la página
    } else {
      const errorData = await respuesta.json();
      if (estado) estado.textContent = `Error: ${errorData.error}`;
      alert(`Error al publicar: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error al enviar la publicación:", error);
    if (estado) estado.textContent = `Error de red: ${error.message}`;
  } finally {
    // Se ejecuta siempre, rehabilitando el botón según la validez del form
    actualizarEstadoFormulario();
  }
}

if (formulario) {
  formulario.addEventListener("submit", manejarEnvio);
}

// =============================================================================
// ENVÍO DE FORMULARIO SECUNDARIO CON FORMDATA
// -----------------------------------------------------------------------------
// [TP: Día 16 - Clase 16: Alta de publicaciones con validación en el servidor]
// Utiliza new FormData(formularioPedido) y Object.fromEntries para capturar el
// contrato de datos del formulario HTML y enviarlo por fetch sin recarga.
// =============================================================================
if (formularioPedido) {
  formularioPedido.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const datos = Object.fromEntries(new FormData(formularioPedido));

    try {
      const respuesta = await fetch(formularioPedido.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(resultado.error || "No se pudo publicar");
      }

      if (salida) salida.textContent = "Publicación agregada con éxito";
      formularioPedido.reset();
    } catch (error) {
      if (salida) salida.textContent = `Error al publicar: ${error.message}`;
    }
  });
}

// =============================================================================
// DELEGACIÓN DE EVENTOS SOBRE LA LISTA DINÁMICA
// -----------------------------------------------------------------------------
// [TP: Día 9 - Partes 2, 3 y 4: Encontrar el control correcto y conectar con el dominio]
// En lugar de agregar un listener a cada botón individual, se escucha el clic en el
// contenedor padre (#lista-publicaciones). Con .closest() detecta el botón presionado
// y su data-accion ('baja' o 'destacar') para ejecutar el método del dominio local.
// =============================================================================
function manejarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !listaPublicaciones.contains(boton)) return;

  const tarjeta = boton.closest("[data-id]");
  const id = Number(tarjeta.dataset.id);
  const accion = boton.dataset.accion;

  if (typeof repositorio !== "undefined") {
    const publicacion = repositorio.publicaciones[id];
    if (!publicacion) return;

    if (accion === "baja") publicacion.darDeBaja();
    if (accion === "destacar") publicacion.destacar();

    renderizarPublicaciones();
  }
}
if (listaPublicaciones) {
  listaPublicaciones.addEventListener("click", manejarAccion);
}

// Botón para forzar recarga de publicaciones
if (botonActualizar) {
  botonActualizar.addEventListener("click", () => cargarPublicaciones());
}

// =============================================================================
// VALIDACIONES REACTIVAS EN DOS TIEMPOS (INPUT vs BLUR)
// -----------------------------------------------------------------------------
// [TP: Días 10-11 - Partes 4 y 6: Validación sin interrumpir y habilitación del botón]
// Con 'input', mostrarError es false: valida en silencio y aplica clases CSS.
// Con 'blur', mostrarError es true: si está inválido, despliega el texto de error.
// =============================================================================

// Validación de Título (mínimo 5 caracteres)
function validarTitulo(mostrarError = true) {
  if (!titulo) return false;
  const valido = titulo.value.trim().length >= 5;
  titulo.classList.toggle("valido", valido);
  titulo.classList.toggle("invalido", !valido && mostrarError);
  if (errorTitulo) {
    errorTitulo.textContent =
      !valido && mostrarError ? "Ingrese al menos 5 caracteres" : "";
  }
  return valido;
}

if (titulo) {
  titulo.addEventListener("input", () => validarTitulo(false));
  titulo.addEventListener("blur", () => validarTitulo(true));
}

// Validación de Autor (mínimo 3 caracteres)
function validarAutor(mostrarError = true) {
  if (!autor) return false;
  const valido = autor.value.trim().length >= 3;
  autor.classList.toggle("valido", valido);
  autor.classList.toggle("invalido", !valido && mostrarError);
  if (errorAutor) {
    errorAutor.textContent =
      !valido && mostrarError ? "Ingrese al menos 3 caracteres" : "";
  }
  return valido;
}

if (autor) {
  autor.addEventListener("input", () => validarAutor(false));
  autor.addEventListener("blur", () => validarAutor(true));
}

// Validación de Precio (mayor a 0 si es tipo 'venta')
function validarPrecio(mostrarError = true) {
  if (!tipo || tipo.value !== "venta") return true;

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

// Comprueba la validez global de todos los campos obligatorios
function formularioValido() {
  if (!titulo || !autor) return false;
  const precioInput = document.querySelector("#precio");
  const precioValido =
    !tipo ||
    tipo.value !== "venta" ||
    (precioInput && Number(precioInput.value) > 0);

  return (
    titulo.value.trim().length >= 5 &&
    autor.value.trim().length >= 3 &&
    precioValido
  );
}

// Habilita o deshabilita el botón de envío según formularioValido()
function actualizarEstadoFormulario() {
  if (enviar) {
    enviar.disabled = !formularioValido();
  }
}

if (formulario) {
  formulario.addEventListener("input", actualizarEstadoFormulario);
}

// =============================================================================
// CONSULTA ASÍNCRONA SIMPLE AL SERVIDOR
// -----------------------------------------------------------------------------
// [TP: Día 12 - Clase 15 - Parte 3: El navegador inicia la solicitud]
// Envía un GET con fetch a /estado-comunidad y escribe el texto plano en el DOM,
// manejando errores con try/catch sin que la página colapse.
// =============================================================================
if (botonConsultar) {
  botonConsultar.addEventListener("click", async () => {
    if (parrafoEstado) parrafoEstado.textContent = "Consultando...";

    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const respuesta = await fetch("/estado-comunidad");
      if (!respuesta.ok) {
        throw new Error("La respuesta no fue exitosa");
      }
      const texto = await respuesta.text();
      if (parrafoEstado) parrafoEstado.textContent = texto;
    } catch (error) {
      if (parrafoEstado)
        parrafoEstado.textContent = `No se pudo consultar el estado: ${error.message}`;
    }
  });
}

// =============================================================================
// DIAGNÓSTICO Y PROCESAMIENTO DE FORMATOS (JSON Y XML)
// -----------------------------------------------------------------------------
// [TP: Día 15 - Clase 18: JSON, XML y persistencia en archivo - Parte 5]
// Una única función de renderizado (mostrarDiagnostico) recibe objetos simples.
// - Con JSON: utiliza JSON.parse(texto).
// - Con XML: utiliza new DOMParser().parseFromString(...) y querySelectorAll para
//   mapear nodos XML a la misma estructura de objetos.
// =============================================================================
function mostrarDiagnostico(publicaciones) {
  if (!diagnosticoLista) return;

  diagnosticoLista.innerHTML = publicaciones
    .map(
      (publicacion) => `
        <li>
          <strong>#${publicacion.id}: ${publicacion.titulo}</strong>
          (por ${publicacion.autor})
          <p>${publicacion.descripcion}</p>
          <small>Categoría: ${publicacion.categoria}</small>
        </li>
      `,
    )
    .join("");
}

if (botonVerJSON) {
  botonVerJSON.addEventListener("click", async () => {
    const texto = await fetch("/datos/publicaciones.json").then((respuesta) =>
      respuesta.text(),
    );
    if (diagnosticoCrudo) diagnosticoCrudo.textContent = texto;
    mostrarDiagnostico(JSON.parse(texto));
  });
}

if (botonVerXML) {
  botonVerXML.addEventListener("click", async () => {
    const texto = await fetch("/datos/publicaciones.xml").then((respuesta) =>
      respuesta.text(),
    );
    if (diagnosticoCrudo) diagnosticoCrudo.textContent = texto;

    const xml = new DOMParser().parseFromString(texto, "application/xml");
    const publicaciones = [...xml.querySelectorAll("publicacion")].map(
      (nodo) => ({
        id: Number(nodo.getAttribute("id")),
        autor: nodo.querySelector("autor")?.textContent || "",
        titulo: nodo.querySelector("titulo")?.textContent || "",
        descripcion: nodo.querySelector("descripcion")?.textContent || "",
        categoria: nodo.querySelector("categoria")?.textContent || "",
        activa: nodo.querySelector("activa")?.textContent === "true",
        etiquetas: (nodo.querySelector("etiquetas")?.textContent || "")
          .split(", ")
          .filter(Boolean),
        estado: nodo.querySelector("estado")?.textContent || "",
      }),
    );

    mostrarDiagnostico(publicaciones);
  });
}
