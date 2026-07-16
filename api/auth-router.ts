import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicMutation } from "./middleware";
import { findUserByEmail, createUser, verifyPassword, updateUserLastSignIn } from "./queries/auth";
import { nanoid } from "nanoid";
import * as jose from "jose";
import { z } from "zod";

const registerInput = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
  register: publicMutation
    .input(registerInput)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

      // Check if user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Create user
      const user = await createUser({ name, email, password });

      // Create session token
      const secret = new TextEncoder().encode(process.env.APP_SECRET);
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
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }),
      );

      return { 
        success: true, 
        user: { 
          name: user.name, 
          email: user.email, 
          role: user.role,
          avatar: user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`
        } 
      };
    }),
  login: publicMutation
    .input(loginInput)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      // Find user
      const user = await findUserByEmail(email);
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Verify password
      if (!user.password) {
        throw new Error("Please use OAuth login or reset password");
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      // Update last sign in
      await updateUserLastSignIn(user.id);

      // Create session token
      const secret = new TextEncoder().encode(process.env.APP_SECRET);
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
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }),
      );

      return { 
        success: true, 
        user: { 
          name: user.name, 
          email: user.email, 
          role: user.role,
          avatar: user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`
        } 
      };
    }),
});
