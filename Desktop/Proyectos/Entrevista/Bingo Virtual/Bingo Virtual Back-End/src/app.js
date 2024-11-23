import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

export default app;
