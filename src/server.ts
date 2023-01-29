import { app } from "./app";
import knex from "./database/knex";

const PORT = 5000;

start_server();

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
