import { Knex } from "knex";

exports.up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable("usersInfo", (table) => {
		table.uuid("id").notNullable().primary().references("id").inTable("users");
		table.string("firstName").notNullable();
		table.string("lastName").notNullable();
		table.uuid("createdBy").notNullable().references("id").inTable("users");
		table.boolean("isAdmin").defaultTo(false);
		table.foreign(["id"]);
	});
};

exports.down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable("usersInfo");
};
