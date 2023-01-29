import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import knex from "./database/knex";

const app = express();

const PORT = 5000;

start_server();

app.get("/", async (_req: Request, res: Response) => {
  return res.send("Rest API is operational!");
});

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
