// src/admin/lib/sdk.ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  // In Admin customizations, Vite envs are exposed via import.meta.env
  baseUrl:
    import.meta.env.VITE_BACKEND_URL ||
    (typeof __BACKEND_URL__ !== "undefined" ? __BACKEND_URL__ : "http://localhost:9000"),
  debug: import.meta.env.DEV,
  // Admin runs with cookie session auth while you're logged into the dashboard
  auth: { type: "session" },
})
