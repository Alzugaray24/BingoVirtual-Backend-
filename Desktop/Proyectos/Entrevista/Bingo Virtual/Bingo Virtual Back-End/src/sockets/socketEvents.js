import gameService from "../services/gameService.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    const emitError = (message) => {
      console.error(message);
      socket.emit("error", message);
    };

    socket.on("viewGames", async () => {
      try {
        const games = await gameService.viewGames();
        socket.emit("gamesList", games);
      } catch (err) {
        emitError("No se pudieron obtener los juegos");
      }
    });

    socket.on("createGame", async () => {
      try {
        const game = await gameService.createGame();
        io.emit("gameCreated", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("deleteGame", async (gameId) => {
      try {
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

    socket.on("joinGame", async (gameId, userId) => {
      try {
        const game = await gameService.joinGame(gameId, userId);
        socket.join(gameId);
        socket.emit("gameJoined", game);

        const newPlayer = game.players.find(
          (player) => player.userId.toString() === userId
        );

        io.to(gameId).emit("newPlayer", newPlayer);
        io.to(gameId).emit("playerJoined", userId);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("startGame", async (gameId) => {
      try {
        const game = await gameService.startGame(gameId);
        io.to(gameId).emit("gameStarted", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("drawBall", async (gameId) => {
      try {
        const { newBall, game } = await gameService.drawBall(gameId);
        io.to(gameId).emit("ballDrawn", { newBall, game });
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("markBall", async (gameId, userId, ballNumber) => {
      try {
        const game = await gameService.markBall(gameId, userId, ballNumber);
        io.to(gameId).emit("ballMarked", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("checkWinCondition", async (gameId, userId) => {
      try {
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

    socket.on("endGame", async (gameId) => {
      try {
        const game = await gameService.endGame(gameId);
        io.to(gameId).emit("gameEnded", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
};
