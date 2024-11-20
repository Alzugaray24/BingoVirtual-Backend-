import gameService from "../services/gameService.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Envoltorio para manejar errores
    const emitError = (message) => {
      console.error(message);
      socket.emit("error", message);
    };

    // Obtener lista de juegos
    socket.on("viewGames", async () => {
      try {
        const games = await gameService.viewGames();
        socket.emit("gamesList", games);
      } catch (err) {
        emitError("No se pudieron obtener los juegos");
      }
    });

    // Crear un nuevo juego
    socket.on("createGame", async () => {
      try {
        console.log("Creando un nuevo juego...");
        const game = await gameService.createGame();
        io.emit("gameCreated", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    // Eliminar un juego
    socket.on("deleteGame", async (gameId) => {
      try {
        console.log(`Eliminando juego con ID: ${gameId}`);
        const game = await gameService.deleteGame(gameId);

        if (game) {
          io.emit("gameDeleted", gameId);
        } else {
          throw new Error("No se encontró el juego para eliminar");
        }
      } catch (err) {
        emitError(err.message);
      }
    });

    // Unirse a un juego
    socket.on("joinGame", async (gameId, userId) => {
      try {
        console.log(`Usuario ${userId} uniéndose al juego ${gameId}...`);
        const game = await gameService.joinGame(gameId, userId);

        // Unir al usuario a la sala del juego
        socket.join(gameId);

        // Enviar el juego actualizado al cliente que se unió
        socket.emit("gameJoined", game);

        // Obtener el nuevo jugador del juego
        const newPlayer = game.players.find(
          (player) => player.userId.toString() === userId
        );

        // Notificar a todos en la sala del nuevo jugador
        io.to(gameId).emit("newPlayer", newPlayer);
        io.to(gameId).emit("playerJoined", userId);
      } catch (err) {
        emitError(err.message);
      }
    });

    // Iniciar un juego
    socket.on("startGame", async (gameId) => {
      try {
        console.log(`Iniciando juego con ID: ${gameId}`);
        const game = await gameService.startGame(gameId);
        io.to(gameId).emit("gameStarted", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    // Sacar una bola
    socket.on("drawBall", async (gameId) => {
      try {
        console.log(`Sacando una bola en el juego ${gameId}...`);
        const { newBall, game } = await gameService.drawBall(gameId);
        io.to(gameId).emit("ballDrawn", { newBall, game });
      } catch (err) {
        emitError(err.message);
      }
    });

    // Marcar una bola
    socket.on("markBall", async (gameId, userId, ballNumber) => {
      try {
        console.log(
          `Usuario ${userId} marcando bola ${ballNumber} en el juego ${gameId}...`
        );
        const game = await gameService.markBall(gameId, userId, ballNumber);
        io.to(gameId).emit("ballMarked", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    // Verificar condición de victoria
    socket.on("checkWinCondition", async (gameId, userId) => {
      try {
        console.log(
          `Verificando condición de victoria para el usuario ${userId} en el juego ${gameId}...`
        );
        const result = await gameService.checkWinCondition(gameId, userId);
        if (result.winner) {
          io.to(gameId).emit("gameWon", result);
        } else {
          socket.emit("playerRemoved", result);
        }
      } catch (err) {
        emitError(err.message);
      }
    });

    // Finalizar un juego
    socket.on("endGame", async (gameId) => {
      try {
        console.log(`Finalizando el juego ${gameId}...`);
        const game = await gameService.endGame(gameId);
        io.to(gameId).emit("gameEnded", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    // Manejo de desconexión
    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
};
