'use client';

// TipTap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Font
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';

// Heading
import Heading from '@tiptap/extension-heading';

// Underline
import Underline from '@tiptap/extension-underline';

// Text Align
import TextAlign from '@tiptap/extension-text-align';

// Subscript and Superscript
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';

// Color
import { Color } from '@tiptap/extension-color';

// Highlight
import Highlight from '@tiptap/extension-highlight';

// Task List
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';

// Link
import Link from '@tiptap/extension-link';

// Table
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

// Image
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';

// Custom extensions
import { useEditorStore } from '@/store/use-editor-store';
import { FontSizeExtension } from '@/extensions/font-size';
import { LineHeightExtension } from '@/extensions/line-height';

// Liveblocks
import { useLiveblocksExtension } from '@liveblocks/react-tiptap';
import { Threads } from './threads';
import { Doc } from '../../../../convex/_generated/dataModel';

interface EditorProps {
  document: Doc<'documents'>;
}

export const Editor = ({ document }: EditorProps) => {
  const liveblocks = useLiveblocksExtension({
    initialContent: document.initialContent,
    offlineSupport_experimental: true,
  });
  const { setEditor } = useEditorStore();
  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right:56px',
        class:
          'focus:outline-none print:border-0 bg-white border rounded border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
      FontSizeExtension,
      LineHeightExtension.configure({
        types: ['heading', 'paragraph'],
        defaultLineHeight: 'normal',
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
      }),
      FontFamily,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Superscript,
      Underline,
      TaskList,
      Heading,
      Highlight.configure({ multicolor: true }),
      Color,
      ImageResize.configure({
        inline: true,
      }),
      Image.configure({
        inline: true,
      }),
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    immediatelyRender: false,
    content: document.initialContent,
  });
  return (
    <div className="size-full overflow-x-auto bg-[#f9fbfd] px-4 print:p-0 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-0">
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
};
