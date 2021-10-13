import { Knex } from "knex";

exports.up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable("usersInfo", (table) => {
		table.uuid("id").notNullable().primary().references("id").inTable("users");
		table.string("firstName").notNullable();
		table.string("lastName").notNullable();
		table.uuid("createdBy").notNullable().references("id").inTable("users");
		table.uuid("updatedBy").nullable().references("id").inTable("users");
		table.timestamp("updatedAt").nullable();
		table.boolean("isAdmin").defaultTo(false);
		table.string("englishLevel").nullable();
		table.string("technicalSkills").nullable();
		table.string("cvLink").nullable();
		table.foreign(["id"]);
	});
};

exports.down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable("usersInfo");
};
