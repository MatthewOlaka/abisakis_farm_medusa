import { defineConfig, loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const config = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "medusa-payment-paystack",
            options: {
              secret_key: process.env.PAYSTACK_SECRET_KEY,
              // webhook_secret: process.env.PAYSTACK_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
  ],
});

export default config;
// Also export CommonJS for loaders that expect module.exports
module.exports = config;
