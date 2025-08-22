import { Editor } from './editor';

interface DocumentIDPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIDPage = async ({ params }: DocumentIDPageProps) => {
  const documentId = (await params).documentId;
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <Editor />
    </div>
  );
};

export default DocumentIDPage;
