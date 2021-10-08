import { Knex } from "knex";
import knexfile from "../db/knexfile";

export interface GraphqlContext {
	knex: Knex;
	schema: typeof knexfile.schema;
	token: string;
}
