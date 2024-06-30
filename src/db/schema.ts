import {
  date,
  datetime,
  int,
  mysqlSchema,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const accountTypeEnum = ["email", "google", "github"] as const;

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: date("email_verified"),
});

export const accounts = mysqlTable("accounts", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
  githubId: varchar("github_id", { length: 255 }).unique(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  password: text("password"),
  salt: text("salt"),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  expiresAt: datetime("expires_at").notNull(),
});

export const resetTokens = mysqlTable("reset_tokens", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: date("token_expires_at").notNull(),
});

export const profiles = mysqlTable("profile", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  displayName: text("display_name"),
  imageId: text("image_id"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export const verifyEmailTokens = mysqlTable("verify_email_tokens", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: date("token_expires_at").notNull(),
});

export type User = typeof users.$inferInsert;
