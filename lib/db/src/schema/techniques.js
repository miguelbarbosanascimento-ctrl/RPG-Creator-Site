import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const techniquesTable = pgTable("techniques", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  source: text("source"),
  abilities: text("abilities"),
  isCustom: boolean("is_custom").notNull().default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true
  }).notNull().defaultNow()
});
export const insertTechniqueSchema = createInsertSchema(techniquesTable).omit({
  id: true,
  createdAt: true
});
