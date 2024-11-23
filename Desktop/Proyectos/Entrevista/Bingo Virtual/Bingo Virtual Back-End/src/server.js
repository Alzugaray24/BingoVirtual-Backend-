import { createServer } from "http";
import { Server } from "socket.io";
import MongoSingleton from "./db/database.js";
import app from "./app.js";
import { initializeSocket } from "./sockets/socketEvents.js";
import config from "./config/config.js";

console.log("Iniciando servidor...", config.port);

MongoSingleton.getInstance();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeSocket(io);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default server;
