import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("users",{
    id : uuid("id").notNull().defaultRandom().primaryKey(),
    username : text("username").unique().notNull(),
    profileImg : text("profile_img").notNull(),
    password : text("password").notNull(),
    createdAt : timestamp("created_at").defaultNow().notNull(),
    updatedAt : timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages",{
    id : uuid("id").notNull().defaultRandom().primaryKey(),
    senderId : uuid("sender_id").references(() => users.id).notNull(),
    receiverId : uuid("receiver_id").references(() => users.id).notNull(),
    content : text("content").notNull(),
    createAt : timestamp("created_at").defaultNow().notNull(),
    updatedAt : timestamp("updated_at").defaultNow().notNull(),
})
