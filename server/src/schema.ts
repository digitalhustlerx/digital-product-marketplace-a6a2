import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  full_name: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Product category enum
export const productCategorySchema = z.enum(['social_media', 'number_service', 'proxy_service']);

export type ProductCategory = z.infer<typeof productCategorySchema>;

// Social media platform enum
export const socialMediaPlatformSchema = z.enum(['facebook', 'instagram', 'twitter', 'tiktok', 'snapchat', 'youtube', 'linkedin', 'other']);

export type SocialMediaPlatform = z.infer<typeof socialMediaPlatformSchema>;

// Proxy type enum
export const proxyTypeSchema = z.enum(['residential', 'datacenter', 'socks5']);

export type ProxyType = z.infer<typeof proxyTypeSchema>;

// Product schema
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: productCategorySchema,
  price: z.number().positive(),
  is_available: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Product = z.infer<typeof productSchema>;

// Social media login details schema
export const socialMediaLoginSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  platform: socialMediaPlatformSchema,
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  email_password: z.string(),
  recovery_codes: z.string().nullable(),
  auth_tokens: z.string().nullable(),
  is_sold: z.boolean(),
  created_at: z.coerce.date()
});

export type SocialMediaLogin = z.infer<typeof socialMediaLoginSchema>;

// Number service schema
export const numberServiceSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  country_code: z.string().length(2), // ISO country code
  country_name: z.string(),
  phone_number: z.string().nullable(), // Will be assigned when purchased
  api_provider: z.string(),
  provider_service_id: z.string().nullable(), // Provider's internal ID
  expires_at: z.coerce.date(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type NumberService = z.infer<typeof numberServiceSchema>;

// Proxy service schema
export const proxyServiceSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  proxy_type: proxyTypeSchema,
  location: z.string(),
  ip_address: z.string().nullable(), // Will be assigned when purchased
  port: z.number().nullable(),
  username: z.string().nullable(),
  password: z.string().nullable(),
  bandwidth_limit: z.string().nullable(), // e.g., "100GB", "unlimited"
  expires_at: z.coerce.date().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type ProxyService = z.infer<typeof proxyServiceSchema>;

// Order status enum
export const orderStatusSchema = z.enum(['pending', 'completed', 'failed', 'refunded']);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
  status: orderStatusSchema,
  total_amount: z.number().positive(),
  payment_method: z.string().nullable(),
  transaction_id: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Order = z.infer<typeof orderSchema>;

// Order item details schema (for purchased items)
export const orderItemDetailsSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  social_media_login_id: z.number().nullable(),
  number_service_id: z.number().nullable(),
  proxy_service_id: z.number().nullable(),
  created_at: z.coerce.date()
});

export type OrderItemDetails = z.infer<typeof orderItemDetailsSchema>;

// Input schemas for creating entities
export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createProductInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  category: productCategorySchema,
  price: z.number().positive()
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

export const createSocialMediaLoginInputSchema = z.object({
  product_id: z.number(),
  platform: socialMediaPlatformSchema,
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  email_password: z.string(),
  recovery_codes: z.string().nullable(),
  auth_tokens: z.string().nullable()
});

export type CreateSocialMediaLoginInput = z.infer<typeof createSocialMediaLoginInputSchema>;

export const createNumberServiceInputSchema = z.object({
  product_id: z.number(),
  country_code: z.string().length(2),
  country_name: z.string(),
  api_provider: z.string(),
  expires_at: z.coerce.date()
});

export type CreateNumberServiceInput = z.infer<typeof createNumberServiceInputSchema>;

export const createProxyServiceInputSchema = z.object({
  product_id: z.number(),
  proxy_type: proxyTypeSchema,
  location: z.string(),
  bandwidth_limit: z.string().nullable(),
  expires_at: z.coerce.date().nullable()
});

export type CreateProxyServiceInput = z.infer<typeof createProxyServiceInputSchema>;

export const createOrderInputSchema = z.object({
  user_id: z.number(),
  product_id: z.number(),
  payment_method: z.string().nullable()
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

// Update schemas
export const updateOrderStatusInputSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
  transaction_id: z.string().nullable().optional()
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusInputSchema>;

// Query schemas
export const getProductsByCategoryInputSchema = z.object({
  category: productCategorySchema
});

export type GetProductsByCategoryInput = z.infer<typeof getProductsByCategoryInputSchema>;

export const getUserOrdersInputSchema = z.object({
  user_id: z.number()
});

export type GetUserOrdersInput = z.infer<typeof getUserOrdersInputSchema>;

export const getOrderDetailsInputSchema = z.object({
  order_id: z.number(),
  user_id: z.number()
});

export type GetOrderDetailsInput = z.infer<typeof getOrderDetailsInputSchema>;