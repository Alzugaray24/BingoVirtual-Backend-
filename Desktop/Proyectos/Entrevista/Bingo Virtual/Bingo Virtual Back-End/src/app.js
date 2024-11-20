import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js"; // Rutas de autenticación

const app = express();

// Configura CORS
app.use(cors({ origin: "*" }));
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes

// Configura las rutas de la API
app.use("/auth", authRouter);

// Configura una ruta para probar que el servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

export default app;
