import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import * as wheelQueries from "./queries/supabase-wheel";

const DISCOUNTS = [5, 10, 15, 20, 25, 30, 35, 40];

export const wheelRouter = createRouter({
  get: authedQuery.query(({ ctx }) => wheelQueries.getWheelSpin(ctx.user.id)),

  spin: authedQuery.mutation(async ({ ctx }) => {
    // Check if user already spun the wheel
    const existing = await wheelQueries.hasSpunWheel(ctx.user.id);
    if (existing) {
      const spin = await wheelQueries.getWheelSpin(ctx.user.id);
      return { discount: spin?.discount, used: spin?.used, expiresAt: spin?.expires_at };
    }

    // Generate random discount
    const discount = DISCOUNTS[Math.floor(Math.random() * DISCOUNTS.length)];
    
    // Expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await wheelQueries.createWheelSpin({
      userId: ctx.user.id,
      discount,
      expiresAt,
    });

    return { discount, used: false, expiresAt };
  }),

  markAsUsed: authedQuery.mutation(({ ctx }) => wheelQueries.markWheelSpinUsed(ctx.user.id)),

  hasValid: authedQuery.query(({ ctx }) => wheelQueries.hasSpunWheel(ctx.user.id)),
});
