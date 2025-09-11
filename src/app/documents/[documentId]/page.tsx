import { preloadQuery } from 'convex/nextjs';

import { auth } from '@clerk/nextjs/server';

import { Document } from './document';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface DocumentIDPageProps {
  params: Promise<{ documentId: Id<'documents'> }>;
}

const DocumentIDPage = async ({ params }: DocumentIDPageProps) => {
  const { documentId } = await params;

  const { getToken } = await auth();
  const token = (await getToken({ template: 'convex' })) ?? undefined;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { documentId },
    { token }
  );

  return <Document preloadedDocument={preloadedDocument} />;
};

export default DocumentIDPage;
