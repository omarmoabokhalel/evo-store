import { z } from "zod";
import { createRouter, publicMutation, adminQuery } from "./middleware";
import * as analyticsQueries from "./queries/supabase-analytics";

export const analyticsRouter = createRouter({
  // Public mutation for tracking page views (no auth required)
  track: publicMutation
    .input(
      z.object({
        page: z.string(),
        sessionId: z.string().optional(),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
      })
    )
    .mutation((args: any) =>
      analyticsQueries.trackPageView({
        page: args.input.page,
        userId: args.ctx.user?.id,
        sessionId: args.input.sessionId,
        ipAddress: args.input.ipAddress,
        userAgent: args.input.userAgent,
      })
    ),

  // Admin queries
  getStats: adminQuery
    .input(z.object({ days: z.number().default(7) }))
    .query((args: any) => analyticsQueries.getPageViewsStats(args.input.days)),

  getTotalViews: adminQuery.query(() => analyticsQueries.getTotalViews()),

  getTopPages: adminQuery
    .input(z.object({ limit: z.number().default(10) }))
    .query((args: any) => analyticsQueries.getTopPages(args.input.limit)),

  getViewsByPage: adminQuery.query(() => analyticsQueries.getViewsByPage()),

  getViewsForPeriod: adminQuery
    .input(z.object({ days: z.number() }))
    .query((args: any) => analyticsQueries.getViewsForPeriod(args.input.days)),

  getOrdersForPeriod: adminQuery
    .input(z.object({ days: z.number() }))
    .query((args: any) => analyticsQueries.getOrdersForPeriod(args.input.days)),

  getRevenueForPeriod: adminQuery
    .input(z.object({ days: z.number() }))
    .query((args: any) => analyticsQueries.getRevenueForPeriod(args.input.days)),
});
