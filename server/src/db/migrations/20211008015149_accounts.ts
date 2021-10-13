import { Knex } from "knex";

exports.up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable("accounts", (table) => {
		table.uuid("id").notNullable().primary().defaultTo(knex.raw("(UUID())"));
		table.string("name").notNullable();
		table.string("client").notNullable();
		table.uuid("lead").notNullable().references("id").inTable("users");
		table.timestamp("createdAt").defaultTo(knex.fn.now());
		table.uuid("createdBy").notNullable().references("id").inTable("users");
		table.uuid("updatedBy").nullable().references("id").inTable("users");
		table.timestamp("updatedAt").nullable();
		table.boolean("isArchived").defaultTo(false);
		table.foreign(["id"]);
	});
};

exports.down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable("accounts");
};
