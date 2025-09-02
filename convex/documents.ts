import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated.
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError('User unauthorized...');

    const documentID = await ctx.db.insert('documents', {
      title: args.title ?? 'Untitled document',
      initialContent: args.initialContent,
      ownerId: user.subject,
    });

    return documentID;
  },
});

export const get = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.query('documents').paginate(args.paginationOpts);
  },
});
