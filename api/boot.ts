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
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { findUserByEmail, createUser, verifyPassword, updateUserLastSignIn } from "./queries/auth";

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

app.post("/api/auth/register", async (c) => {
  const body = await c.req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return c.json({ error: "Name, email, and password are required" }, 400);
  }

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return c.json({ error: "Email already registered" }, 400);
  }

  // Create user
  const user = await createUser({ name, email, password });

  // Create session token
  const secret = new TextEncoder().encode(env.appSecret);
  const token = await new jose.SignJWT({
    unionId: user.unionId,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  // Set cookie
  const opts = getSessionCookieOptions(c.req.headers);
  c.resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }),
  );

  return c.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
    },
  });
});

app.post("/api/auth/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  // Verify password
  if (!user.password) {
    return c.json({ error: "Please use OAuth login or reset password" }, 400);
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  // Update last sign in
  await updateUserLastSignIn(user.id);

  // Create session token
  const secret = new TextEncoder().encode(env.appSecret);
  const token = await new jose.SignJWT({
    unionId: user.unionId,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  // Set cookie
  const opts = getSessionCookieOptions(c.req.headers);
  c.resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }),
  );

  return c.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
    },
  });
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

const { serve } = await import("@hono/node-server");

if (env.isProduction) {
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);
}

const port = parseInt(process.env.PORT || "3001");
serve({ fetch: app.fetch, port }, () => {
  console.log(`API Server running on http://localhost:${port}/`);
});
