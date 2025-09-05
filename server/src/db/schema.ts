import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  numeric, 
  boolean, 
  integer,
  pgEnum,
  varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const productCategoryEnum = pgEnum('product_category', ['social_media', 'number_service', 'proxy_service']);
export const socialMediaPlatformEnum = pgEnum('social_media_platform', ['facebook', 'instagram', 'twitter', 'tiktok', 'snapchat', 'youtube', 'linkedin', 'other']);
export const proxyTypeEnum = pgEnum('proxy_type', ['residential', 'datacenter', 'socks5']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'completed', 'failed', 'refunded']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Products table
export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: productCategoryEnum('category').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  is_available: boolean('is_available').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Social media login details table
export const socialMediaLoginsTable = pgTable('social_media_logins', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  platform: socialMediaPlatformEnum('platform').notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  email_password: varchar('email_password', { length: 255 }).notNull(),
  recovery_codes: text('recovery_codes'),
  auth_tokens: text('auth_tokens'),
  is_sold: boolean('is_sold').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Number services table
export const numberServicesTable = pgTable('number_services', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  country_code: varchar('country_code', { length: 2 }).notNull(),
  country_name: varchar('country_name', { length: 100 }).notNull(),
  phone_number: varchar('phone_number', { length: 20 }),
  api_provider: varchar('api_provider', { length: 100 }).notNull(),
  provider_service_id: varchar('provider_service_id', { length: 255 }),
  expires_at: timestamp('expires_at').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Proxy services table
export const proxyServicesTable = pgTable('proxy_services', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  proxy_type: proxyTypeEnum('proxy_type').notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  ip_address: varchar('ip_address', { length: 45 }),
  port: integer('port'),
  username: varchar('username', { length: 255 }),
  password: varchar('password', { length: 255 }),
  bandwidth_limit: varchar('bandwidth_limit', { length: 50 }),
  expires_at: timestamp('expires_at'),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Orders table
export const ordersTable = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  status: orderStatusEnum('status').default('pending').notNull(),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  payment_method: varchar('payment_method', { length: 100 }),
  transaction_id: varchar('transaction_id', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Order item details table (linking orders to specific purchased items)
export const orderItemDetailsTable = pgTable('order_item_details', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => ordersTable.id),
  social_media_login_id: integer('social_media_login_id').references(() => socialMediaLoginsTable.id),
  number_service_id: integer('number_service_id').references(() => numberServicesTable.id),
  proxy_service_id: integer('proxy_service_id').references(() => proxyServicesTable.id),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  orders: many(ordersTable)
}));

export const productsRelations = relations(productsTable, ({ many }) => ({
  orders: many(ordersTable),
  socialMediaLogins: many(socialMediaLoginsTable),
  numberServices: many(numberServicesTable),
  proxyServices: many(proxyServicesTable)
}));

export const socialMediaLoginsRelations = relations(socialMediaLoginsTable, ({ one, many }) => ({
  product: one(productsTable, {
    fields: [socialMediaLoginsTable.product_id],
    references: [productsTable.id]
  }),
  orderItemDetails: many(orderItemDetailsTable)
}));

export const numberServicesRelations = relations(numberServicesTable, ({ one, many }) => ({
  product: one(productsTable, {
    fields: [numberServicesTable.product_id],
    references: [productsTable.id]
  }),
  orderItemDetails: many(orderItemDetailsTable)
}));

export const proxyServicesRelations = relations(proxyServicesTable, ({ one, many }) => ({
  product: one(productsTable, {
    fields: [proxyServicesTable.product_id],
    references: [productsTable.id]
  }),
  orderItemDetails: many(orderItemDetailsTable)
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.user_id],
    references: [usersTable.id]
  }),
  product: one(productsTable, {
    fields: [ordersTable.product_id],
    references: [productsTable.id]
  }),
  orderItemDetails: many(orderItemDetailsTable)
}));

export const orderItemDetailsRelations = relations(orderItemDetailsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemDetailsTable.order_id],
    references: [ordersTable.id]
  }),
  socialMediaLogin: one(socialMediaLoginsTable, {
    fields: [orderItemDetailsTable.social_media_login_id],
    references: [socialMediaLoginsTable.id]
  }),
  numberService: one(numberServicesTable, {
    fields: [orderItemDetailsTable.number_service_id],
    references: [numberServicesTable.id]
  }),
  proxyService: one(proxyServicesTable, {
    fields: [orderItemDetailsTable.proxy_service_id],
    references: [proxyServicesTable.id]
  })
}));

// TypeScript types
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;

export type SocialMediaLogin = typeof socialMediaLoginsTable.$inferSelect;
export type NewSocialMediaLogin = typeof socialMediaLoginsTable.$inferInsert;

export type NumberService = typeof numberServicesTable.$inferSelect;
export type NewNumberService = typeof numberServicesTable.$inferInsert;

export type ProxyService = typeof proxyServicesTable.$inferSelect;
export type NewProxyService = typeof proxyServicesTable.$inferInsert;

export type Order = typeof ordersTable.$inferSelect;
export type NewOrder = typeof ordersTable.$inferInsert;

export type OrderItemDetails = typeof orderItemDetailsTable.$inferSelect;
export type NewOrderItemDetails = typeof orderItemDetailsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  products: productsTable,
  socialMediaLogins: socialMediaLoginsTable,
  numberServices: numberServicesTable,
  proxyServices: proxyServicesTable,
  orders: ordersTable,
  orderItemDetails: orderItemDetailsTable
};