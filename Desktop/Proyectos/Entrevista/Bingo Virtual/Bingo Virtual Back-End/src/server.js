import { createServer } from "http";
import { Server } from "socket.io";
import MongoSingleton from "./db/database.js"; // Conexión a la base de datos
import app from "./app.js"; // Importa la configuración de Express
import { initializeSocket } from "./sockets/socketEvents.js"; // Importa los eventos de Socket.IO

// Conexión a la base de datos
MongoSingleton.getInstance();

// Crea un servidor HTTP con Express
const server = createServer(app);

// Configura Socket.IO en el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexiones desde cualquier origen
  },
});

// Inicializar los eventos de Socket.IO
initializeSocket(io);

// Inicia el servidor en el puerto 8080
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default server;
