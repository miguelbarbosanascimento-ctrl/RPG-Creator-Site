import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const domainsTable = pgTable("domain_expansions", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  appearance: text("appearance"),
  barrier: text("barrier"),
  guaranteedEffect: text("guaranteed_effect"),
  conditions: text("conditions"),
  activationPhrase: text("activation_phrase"),
  buffs: text("buffs"),
  debuffs: text("debuffs"),
  cost: integer("cost").notNull().default(10),
  ownerCharacterId: integer("owner_character_id"),
  createdAt: timestamp("created_at", {
    withTimezone: true
  }).notNull().defaultNow()
});
export const insertDomainSchema = createInsertSchema(domainsTable).omit({
  id: true,
  userId: true,
  createdAt: true
});
