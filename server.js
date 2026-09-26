import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Servir la carpeta estática
app.use(express.static(path.join(__dirname, "public")));

// Datos iniciales de prueba
const publicacionesIniciales = [
  {
    titulo: "Libro de Álgebra I",
    descripcion: "Edición con ejercicios resueltos",
    autor: "Clara Ornella",
    email: "clara@uns.edu.ar",
    tipo: "venta",
    precio: 12000,
    activa: true,
    destacado: true
  },
  {
    titulo: "Tutorías de Programación Web",
    descripcion: "Preparación para parciales de JavaScript y DOM",
    autor: "Martín Pérez",
    email: "martin@uns.edu.ar",
    tipo: "servicio",
    modalidad: "remoto",
    duracion: 90,
    activa: true,
    destacado: false
  }
];

// Endpoint /api/publicaciones requerido por la consigna
app.get("/api/publicaciones", (req, res) => {
  // Si viene con ?error=1, simula la respuesta fallida
  if (req.query.error === "1") {
    return res.status(500).json({ error: "Error forzado del servidor" });
  }

  res.json(publicacionesIniciales);
});

app.listen(3000, () => console.log("http://localhost:3000"));