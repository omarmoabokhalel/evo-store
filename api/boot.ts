import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./auth/auth";
import { Paths } from "@contracts/constants";
import * as jose from "jose";
import { nanoid } from "nanoid";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.post("/api/auth/mock-login", async (c) => {
  const body = await c.req.json();
  const { name, email, avatar, role, state } = body;

  if (!name || !email) {
    return c.json({ error: "Name and email are required" }, 400);
  }

  const unionId = `mock-${email.replace(/[^a-zA-Z0-9]/g, "-")}-${nanoid(6)}`;
  const secret = new TextEncoder().encode(env.appSecret);
  const code = await new jose.SignJWT({
    name,
    email,
    avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    role: role || "user",
    unionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);

  const redirectUrl = `/api/oauth/callback?code=${code}&state=${state}`;
  return c.json({ redirectUrl });
});

app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
