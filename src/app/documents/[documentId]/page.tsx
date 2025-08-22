import { Editor } from './editor';
import { Toolbar } from './toolbar';

// interface DocumentIDPageProps {
//   params: Promise<{ documentId: string }>;
// }

const DocumentIDPage = async () => {
  //   const documentId = (await params).documentId;
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <Toolbar />
      <Editor />
    </div>
  );
};

export default DocumentIDPage;
