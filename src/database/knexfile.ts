import type { Knex } from "knex";

import path from "path";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: ":memory:", // using in-memory as per technical requirements
    },
    pool: {
      min: 1,
      max: 1,
      idleTimeoutMillis: 3600 * 100 * 1000, // set timeout to 100 hours to avoid https://github.com/knex/knex/issues/1871
    },

    useNullAsDefault: true,
    migrations: {
      directory: `${path.resolve(__dirname)}/migrations`,
    },
  },
};

export default config;
