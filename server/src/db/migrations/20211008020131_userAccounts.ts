import { Knex } from "knex";

exports.up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable("userAccounts", (table) => {
		table.uuid("user").notNullable().references("id").inTable("users");
		table.uuid("account").notNullable().references("id").inTable("accounts");
		table.timestamp("initDate").defaultTo(knex.fn.now());
		table.timestamp("endDate");
		table.uuid("addedBy").notNullable().references("id").inTable("users");
		table.uuid("removedBy").references("id").inTable("users");
		table.boolean("isLead").defaultTo(false);
	});
};

exports.down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable("userAccounts");
};
