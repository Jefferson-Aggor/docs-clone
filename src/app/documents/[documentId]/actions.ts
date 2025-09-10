'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

export async function getUsers() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();

  const { data } = await clerk.users.getUserList({
    organizationId: [(sessionClaims as any)?.o?.id as string],
  });

  const users = data.map((user) => ({
    id: user.id,
    name:
      user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Anonymous',
    avatar: user.imageUrl,
  }));

  return users;
}
