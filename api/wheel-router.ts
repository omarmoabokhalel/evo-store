import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import * as wheelQueries from "./queries/wheel";

const DISCOUNTS = [5, 10, 15, 20, 25, 30, 35, 40];

export const wheelRouter = createRouter({
  get: authedQuery.query(({ ctx }) => wheelQueries.getUserWheelSpin(ctx.user.id)),

  spin: authedQuery.mutation(async ({ ctx }) => {
    // Check if user already has a valid spin
    const existing = await wheelQueries.hasValidWheelSpin(ctx.user.id);
    if (existing) {
      return { discount: existing.discount, used: existing.used, expiresAt: existing.expiresAt };
    }

    // Generate random discount
    const discount = DISCOUNTS[Math.floor(Math.random() * DISCOUNTS.length)];
    
    // Expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await wheelQueries.createWheelSpin({
      userId: ctx.user.id,
      discount,
      used: false,
      expiresAt,
    });

    return { discount, used: false, expiresAt };
  }),

  markAsUsed: authedQuery.mutation(({ ctx }) => wheelQueries.markWheelSpinAsUsed(ctx.user.id)),

  hasValid: authedQuery.query(({ ctx }) => wheelQueries.hasValidWheelSpin(ctx.user.id)),
});
