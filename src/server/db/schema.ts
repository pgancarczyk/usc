// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  integer,
  timestamp,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";

/**
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `usc_${name}`);

export const venues = createTable(
  "venue",
  {
    id: varchar("slug", { length: 256 }).primaryKey(),
    name: varchar("name", { length: 256 }),
    telephone: varchar("telephone", { length: 256 }),
    postalCode: varchar("postal_code", { length: 256 }),
    streetAddress: varchar("street_address", { length: 256 }),
    latitude: numeric("latitude"),
    longitude: numeric("longitude"),
    planLimit: integer("plan_limit"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (i) => ({
    nameIndex: index("venue_name_index").on(i.name),
  }),
);

export const venuesRelations = relations(venues, ({ many }) => ({
  activities: many(activities),
}));

export const categories = createTable("category", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 256 }),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  activities: many(activities),
}));

export const activities = createTable(
  "activity",
  {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    venueId: varchar("venue_id", { length: 256 }).notNull(),
    categoryId: integer("category_id"),
    start: timestamp("start").notNull(),
    end: timestamp("end").notNull(),
    spotsLeft: integer("spots_left"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (i) => ({
    nameIndex: index("activity_name_index").on(i.name),
    venueIndex: index("activity_venue_index").on(i.venueId),
    categoryIndex: index("activity_category_index").on(i.categoryId),
  }),
);

export const activitiesRelations = relations(activities, ({ one }) => ({
  venues: one(venues, {
    fields: [activities.venueId],
    references: [venues.id],
  }),
  categories: one(categories, {
    fields: [activities.categoryId],
    references: [categories.id],
  }),
}));

export type ActivityInsert = typeof activities.$inferInsert;
export type ActivitySelect = typeof activities.$inferSelect;
