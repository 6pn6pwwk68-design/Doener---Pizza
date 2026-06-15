import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: serial().primaryKey(),
  username: text("username").notNull(),
  items: jsonb("items").notNull(),
  total: text("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
