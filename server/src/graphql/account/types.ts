import Knex from "knex";

export interface UpdateAccount {
	name?: string;
	client?: string;
	lead?: string;
	updatedBy: string;
	updatedAt: Knex.QueryBuilder;
}
