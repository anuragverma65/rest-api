import { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("credit_cards", (table: Knex.TableBuilder) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(uuidv4())
      .comment("uuid primary key for the table");
    table.string("linked_user_full_name").comment("full name of the card user");
    table.string("card_number");
    table
      .string("card_provider")
      .comment("name of the bank/entity providing the card");
    table.float("limit").defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("credit_cards");
}
