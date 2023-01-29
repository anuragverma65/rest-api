import knex from "knex";

import knexFile from "./knexfile";

const env = "development";
const options = knexFile[env];

export default knex(options);
