import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createUserInputSchema,
  createProductInputSchema,
  createSocialMediaLoginInputSchema,
  createNumberServiceInputSchema,
  createProxyServiceInputSchema,
  createOrderInputSchema,
  updateOrderStatusInputSchema,
  getProductsByCategoryInputSchema,
  getUserOrdersInputSchema,
  getOrderDetailsInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { createProduct } from './handlers/create_product';
import { getProducts } from './handlers/get_products';
import { getProductsByCategory } from './handlers/get_products_by_category';
import { createSocialMediaLogin } from './handlers/create_social_media_login';
import { createNumberService } from './handlers/create_number_service';
import { createProxyService } from './handlers/create_proxy_service';
import { createOrder } from './handlers/create_order';
import { updateOrderStatus } from './handlers/update_order_status';
import { getUserOrders } from './handlers/get_user_orders';
import { getOrderDetails } from './handlers/get_order_details';
import { fulfillOrder } from './handlers/fulfill_order';
import { getAvailableSocialMediaLogins } from './handlers/get_available_social_media_logins';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  // Product management
  createProduct: publicProcedure
    .input(createProductInputSchema)
    .mutation(({ input }) => createProduct(input)),

  getProducts: publicProcedure
    .query(() => getProducts()),

  getProductsByCategory: publicProcedure
    .input(getProductsByCategoryInputSchema)
    .query(({ input }) => getProductsByCategory(input)),

  // Digital product inventory management
  createSocialMediaLogin: publicProcedure
    .input(createSocialMediaLoginInputSchema)
    .mutation(({ input }) => createSocialMediaLogin(input)),

  createNumberService: publicProcedure
    .input(createNumberServiceInputSchema)
    .mutation(({ input }) => createNumberService(input)),

  createProxyService: publicProcedure
    .input(createProxyServiceInputSchema)
    .mutation(({ input }) => createProxyService(input)),

  getAvailableSocialMediaLogins: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(({ input }) => getAvailableSocialMediaLogins(input.productId)),

  // Order management
  createOrder: publicProcedure
    .input(createOrderInputSchema)
    .mutation(({ input }) => createOrder(input)),

  updateOrderStatus: publicProcedure
    .input(updateOrderStatusInputSchema)
    .mutation(({ input }) => updateOrderStatus(input)),

  getUserOrders: publicProcedure
    .input(getUserOrdersInputSchema)
    .query(({ input }) => getUserOrders(input)),

  getOrderDetails: publicProcedure
    .input(getOrderDetailsInputSchema)
    .query(({ input }) => getOrderDetails(input)),

  // Order fulfillment
  fulfillOrder: publicProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(({ input }) => fulfillOrder(input.orderId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();