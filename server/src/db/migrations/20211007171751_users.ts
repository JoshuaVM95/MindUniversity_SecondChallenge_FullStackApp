import { Knex } from "knex";

exports.up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable("users", (table) => {
		table.uuid("id").notNullable().primary().defaultTo(knex.raw("(UUID())"));
		table.string("email").notNullable().unique();
		table.string("password").notNullable();
		table.string("salt").notNullable();
		table.boolean("isSuper").defaultTo(false);
		table.timestamp("createdAt").defaultTo(knex.fn.now());
		table.boolean("isArchived").defaultTo(false);
		table.foreign(["id"]);
	});
};

exports.down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable("users");
};
