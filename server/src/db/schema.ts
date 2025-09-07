import { 
  integer, 
  text, 
  sqliteTable, 
  real, 
  integer as boolean
} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Enums - using simple text fields for SQLite

// Users table
export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  full_name: text('full_name').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
});

// Products table
export const productsTable = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  price: real('price').notNull(),
  is_available: integer('is_available', { mode: 'boolean' }).default(true).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
});

// Social media login details table
export const socialMediaLoginsTable = sqliteTable('social_media_logins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  platform: text('platform').notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull(),
  email_password: text('email_password').notNull(),
  recovery_codes: text('recovery_codes'),
  auth_tokens: text('auth_tokens'),
  is_sold: integer('is_sold', { mode: 'boolean' }).default(false).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
});

// Number services table
export const numberServicesTable = sqliteTable('number_services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  country_code: text('country_code').notNull(),
  country_name: text('country_name').notNull(),
  phone_number: text('phone_number'),
  api_provider: text('api_provider').notNull(),
  provider_service_id: text('provider_service_id'),
  expires_at: integer('expires_at', { mode: 'timestamp' }).notNull(),
  is_active: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
});

// Proxy services table
export const proxyServicesTable = sqliteTable('proxy_services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  proxy_type: text('proxy_type').notNull(),
  location: text('location').notNull(),
  ip_address: text('ip_address'),
  port: integer('port'),
  username: text('username'),
  password: text('password'),
  bandwidth_limit: text('bandwidth_limit'),
  expires_at: integer('expires_at', { mode: 'timestamp' }),
  is_active: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
});

// Orders table
export const ordersTable = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  status: text('status').default('pending').notNull(),
  total_amount: real('total_amount').notNull(),
  payment_method: text('payment_method'),
  transaction_id: text('transaction_id'),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
});

// Order item details table (linking orders to specific purchased items)
export const orderItemDetailsTable = sqliteTable('order_item_details', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  order_id: integer('order_id').notNull().references(() => ordersTable.id),
  social_media_login_id: integer('social_media_login_id').references(() => socialMediaLoginsTable.id),
  number_service_id: integer('number_service_id').references(() => numberServicesTable.id),
  proxy_service_id: integer('proxy_service_id').references(() => proxyServicesTable.id),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
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