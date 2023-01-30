import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("credit_cards", (table) => {
    table.unique(["card_number"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("credit_cards", (table) => {
    table.dropUnique(["card_number"]);
  });
}
