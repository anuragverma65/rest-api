import express from "express";

import knex from "./database/knex";
import { router } from "./routes";

const app = express();

const PORT = 5000;

start_server();

app.use(express.json());

app.use("/api/v1", router);

async function start_server() {
  try {
    await knex.migrate.latest();
    console.log("Database migration succesful. Database is ready");
  } catch (e) {
    console.error("database migration failed", e);
  }
  app.listen(PORT, () => {
    console.log("Server is running on port 5000");
  });
}
