'use client';
import { useEditorStore } from '@/store/use-editor-store';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

import Image from 'next/image';
import Link from 'next/link';
import { DocumentInput } from './document-input';
import { BsFilePdf } from 'react-icons/bs';
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  Strikethrough,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-react';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Avatars } from './avatars';
import { Inbox } from './inbox';
import { Doc } from '../../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RenameDialog } from '@/components/rename-dialog';
import { RemoveDialog } from '@/components/remove-dialog';

interface NavbarProps {
  data: Doc<'documents'>;
}

export const Navbar = ({ data }: NavbarProps) => {
  const { editor } = useEditorStore();
  const router = useRouter();

  const documentCreate = useMutation(api.documents.create);

  const OnCreateNewDocument = () => {
    documentCreate({ title: 'New Document', initialContent: '' }).then(
      (documentId) => {
        router.push(`/documents/${documentId}`);
        toast.success('Document created');
      }
    );
  };

  const generateTableGrid = () => {
    const grid = [];
    for (let i = 1; i < 6; i++) {
      for (let j = 1; j < 6; j++) {
        grid.push({
          row: i,
          col: j,
          label: `${i} x ${j}`,
        });
      }
    }

    return grid;
  };

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
  };

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const onSaveJSON = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: 'application/json',
    });

    onDownload(blob, `${data.title}.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: 'text/html',
    });

    onDownload(blob, `${data.title}.html`);
  };

  const onSaveText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], {
      type: 'text/plain',
    });

    onDownload(blob, `${data.title}.txt`);
  };

  return (
    <nav className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href={'/'}>
          <Image src={'/logo.svg'} width={36} height={36} alt="logo" />
        </Link>
        <div className="flex flex-col">
          <DocumentInput title={data.title} id={data._id} />
          <div className="flex">
            <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  File
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="size-4 mr-2" /> Save
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={window.print}>
                        <BsFilePdf className="size-4 mr-2" /> PDF
                      </MenubarItem>
                      <MenubarItem onClick={onSaveText}>
                        <FileTextIcon className="size-4 mr-2" /> Text
                      </MenubarItem>
                      <MenubarItem onClick={onSaveJSON}>
                        <FileJsonIcon className="size-4 mr-2" /> JSON
                      </MenubarItem>
                      <MenubarItem onClick={onSaveHTML}>
                        <GlobeIcon className="size-4 mr-2" /> HTML
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarItem onClick={OnCreateNewDocument}>
                    <FilePlusIcon className="size-4 mr-2" />
                    New Document
                  </MenubarItem>

                  <MenubarSeparator />
                  <div className="flex flex-col">
                    <RenameDialog documentId={data._id} title={data.title}>
                      <MenubarItem onSelect={(e) => e.preventDefault()}>
                        <FilePenIcon className="size-4 mr-2" />
                        Rename
                      </MenubarItem>
                    </RenameDialog>

                    <RemoveDialog documentId={data._id}>
                      <MenubarItem onSelect={(e) => e.preventDefault()}>
                        <TrashIcon className="size-4 mr-2" />
                        Remove
                      </MenubarItem>
                    </RemoveDialog>
                  </div>
                  <MenubarSeparator />

                  <MenubarItem onClick={window.print}>
                    <PrinterIcon className="size-4 mr-2" />
                    Print <MenubarShortcut>ctrl+p</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() => editor?.chain().focus().undo().run()}
                  >
                    <Undo2Icon className="size-4 mr-2" /> Undo
                    <MenubarShortcut>ctrl + z</MenubarShortcut>
                  </MenubarItem>

                  <MenubarItem
                    onClick={() => editor?.chain().focus().redo().run()}
                  >
                    <Redo2Icon className="size-4 mr-2" /> Redo
                    <MenubarShortcut>ctrl + y</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Insert
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>Table</MenubarSubTrigger>
                    <MenubarSubContent className="h-[250px] overflow-y-auto">
                      {generateTableGrid().map(({ row, col, label }) => (
                        <MenubarItem
                          onClick={() => insertTable({ rows: row, cols: col })}
                          key={label}
                        >
                          {label}
                        </MenubarItem>
                      ))}
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Format
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="size-4 mr-2" /> Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleBold().run()
                        }
                      >
                        <BoldIcon className="size-4 mr-2" /> Bold{' '}
                        <MenubarShortcut>ctrl+b</MenubarShortcut>
                      </MenubarItem>

                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleItalic().run()
                        }
                      >
                        <ItalicIcon className="size-4 mr-2" /> Italic{' '}
                        <MenubarShortcut>ctrl+i</MenubarShortcut>
                      </MenubarItem>

                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleUnderline().run()
                        }
                      >
                        <UnderlineIcon className="size-4 mr-2" /> Underline{' '}
                        <MenubarShortcut>ctrl+u</MenubarShortcut>
                      </MenubarItem>

                      <MenubarItem
                        onClick={() =>
                          editor?.chain().focus().toggleStrike().run()
                        }
                      >
                        <Strikethrough className="size-4 mr-2" />{' '}
                        <span className="line-through">Strikethrough</span>
                        &nbsp; &nbsp;
                        <MenubarShortcut>ctrl+s</MenubarShortcut>
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem
                    onClick={() =>
                      editor?.chain().focus().unsetAllMarks().run()
                    }
                  >
                    <RemoveFormattingIcon className="size-4 mr-4" /> Clear
                    formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-3 pl-6">
        <Avatars />
        <Inbox />
        <OrganizationSwitcher
          afterCreateOrganizationUrl={'/'}
          afterLeaveOrganizationUrl={'/'}
          afterSelectOrganizationUrl={'/'}
          afterSelectPersonalUrl={'/'}
        />
        <UserButton />
      </div>
    </nav>
  );
};
