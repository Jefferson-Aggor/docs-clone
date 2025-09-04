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

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    const documentID = await ctx.db.insert('documents', {
      title: args.title ?? 'Untitled document',
      initialContent: args.initialContent,
      organizationId,
      ownerId: user.subject,
    });

    return documentID;
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError('User unauthorized...');

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    if (search && organizationId !== undefined) {
      return ctx.db
        .query('documents')
        .withSearchIndex('search_title', (q) =>
          q.search('title', search).eq('organizationId', organizationId)
        )
        .paginate(paginationOpts);
    }

    if (search) {
      return ctx.db
        .query('documents')
        .withSearchIndex('search_title', (q) =>
          q.search('title', search).eq('ownerId', user.subject)
        )
        .paginate(paginationOpts);
    }

    if (organizationId) {
      return await ctx.db
        .query('documents')
        .withIndex('by_organization_id', (q) =>
          q.eq('organizationId', organizationId)
        )
        .paginate(paginationOpts);
    }

    return await ctx.db
      .query('documents')
      .withIndex('by_owner_id', (q) => q.eq('ownerId', user.subject))
      .paginate(paginationOpts);
  },
});

export const removeById = mutation({
  args: { documentId: v.id('documents') },
  handler: async (ctx, args) => {
    // Check if user is authenticated.
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError('User unauthorized...');

    const document = await ctx.db.get(args.documentId);

    if (!document) throw new ConvexError('Document not found');

    const isOwner = document.ownerId === user.subject;

    if (!isOwner || user.organization_role == 'org:member')
      throw new ConvexError('User unauthorized');

    return await ctx.db.delete(args.documentId);
  },
});

export const updateById = mutation({
  args: { documentId: v.id('documents'), title: v.string() },
  handler: async (ctx, args) => {
    // Check if user is authenticated.
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError('User unauthorized...');

    const document = await ctx.db.get(args.documentId);

    if (!document) throw new ConvexError('Document not found');

    const isOwner = document.ownerId === user.subject;

    if (!isOwner && user.organization_role == 'org:member')
      throw new ConvexError('User unauthorized');

    return await ctx.db.patch(args.documentId, { title: args.title });
  },
});
