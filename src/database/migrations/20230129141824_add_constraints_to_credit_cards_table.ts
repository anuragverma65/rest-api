import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("credit_cards", (table) => {
    table.string("card_number").notNullable().alter();
    table.string("linked_user_full_name").notNullable().alter();
    table.string("card_provider").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("credit_cards", (table) => {
    table.string("card_number").nullable().alter();
    table.string("linked_user_full_name").nullable().alter();
    table.string("card_provider").nullable().alter();
  });
}
