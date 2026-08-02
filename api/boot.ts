import 'dotenv/config'
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use("/api/trpc/*", async (c) => {
  console.log('TRPC Request:', c.req.method, c.req.url);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => {
  console.log('404 Request:', c.req.method, c.req.url);
  return c.json({ error: "Not Found" }, 404);
});

export default app;

const { serve } = await import("@hono/node-server");

if (process.env.NODE_ENV === 'production') {
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);
}

const port = parseInt(process.env.PORT || "3001");
serve({ fetch: app.fetch, port }, () => {
  console.log(`API Server running on http://localhost:${port}/`);
});
