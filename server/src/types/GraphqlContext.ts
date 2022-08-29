import { PrismaClient } from "@prisma/client";
import { Knex } from "knex";
import knexfile from "../db/knexfile";

export interface GraphqlContext {
	knex: Knex;
	schema: typeof knexfile.schema;
	token: string;
	prisma: PrismaClient;
}
