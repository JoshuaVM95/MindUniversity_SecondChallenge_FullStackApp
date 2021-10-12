import { Knex } from "knex";

exports.up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable("userAccounts", (table) => {
		table.uuid("id").notNullable().primary().defaultTo(knex.raw("(UUID())"));
		table.uuid("user").notNullable().references("id").inTable("users");
		table.uuid("account").notNullable().references("id").inTable("accounts");
		table.timestamp("initDate").defaultTo(knex.fn.now());
		table.timestamp("endDate").nullable();
		table.uuid("addedBy").notNullable().references("id").inTable("users");
		table.uuid("removedBy").references("id").inTable("users");
		table.string("position").notNullable();
	});
};

exports.down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable("userAccounts");
};
