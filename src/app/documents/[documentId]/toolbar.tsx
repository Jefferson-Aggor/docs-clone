'use client';

import { useState } from 'react';
import { type Level } from '@tiptap/extension-heading';
import { type ColorResult, CirclePicker } from 'react-color';

import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/use-editor-store';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  Link2Off,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SearchIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
  UploadIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}
const ToolbarButton = ({
  icon: Icon,
  isActive,
  onClick,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80',
        isActive && 'bg-neutral-200/80'
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

const FontFamily = () => {
  const { editor } = useEditorStore();

  const fonts: { label: string; value: string }[] = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <span className="truncate">
            {editor?.getAttributes('textStyle').fontFamily || 'Arial'}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            className={cn(
              'flex flex-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
              editor?.getAttributes('textStyle').fontFamily === value &&
                'bg-neutral-200/80'
            )}
            style={{ fontFamily: value }}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
          >
            <span className="text-sm">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HeadingLevelButton = () => {
  const [open, setOpen] = useState(false);
  const { editor } = useEditorStore();

  const headings = [
    { label: 'Normal text', level: 0, fontSize: '16px' },
    { label: 'Heading 1', level: 1, fontSize: '32px' },
    { label: 'Heading 2', level: 2, fontSize: '24px' },
    { label: 'Heading 3', level: 3, fontSize: '20px' },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level++) {
      if (editor?.isActive('heading', { level })) {
        return `Heading ${level}`;
      }
    }
    return 'Normal text';
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
        >
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, level, fontSize }) => (
          <button
            key={level}
            style={{ fontSize }}
            className={cn(
              'flex flex-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80',
              (level === 0 && !editor?.isActive('heading')) ||
                (editor?.isActive('heading', { level: level }) &&
                  'bg-neutral-200/80')
            )}
            onClick={() => {
              if (level === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: level as Level })
                  .run();
              }

              setOpen(false);
            }}
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes('textStyle').color || '#000000';

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <span className="text-xs">A</span>
          <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <CirclePicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextHighlightButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes('highlight').color || '#FFFFFF';
  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <HighlighterIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <CirclePicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState('');

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setValue('');
  };

  return (
    <div className="flex gap-x-1">
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) {
            setValue(editor?.getAttributes('link').href || '');
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <button className="h-7 min-w-7 shrink-0 flex  items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
            <Link2Icon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://google.com"
          />
          <Button onClick={() => onChange(value)}>Apply</Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        onClick={() => {
          editor?.chain().focus().unsetLink().run();
        }}
        className="h-7 min-w-7 shrink-0 flex  items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
      >
        <Link2Off className="size-4" />
      </button>
    </div>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };

    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl('');
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 min-w-7 shrink-0 flex  items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 ">
          <p className="text-sm text-muted-foreground mb-2">
            Upload your images
          </p>
          <div className=" gap-y-2">
            <DropdownMenuItem onClick={onUpload}>
              <UploadIcon className="size-4 mr-2" /> Upload
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              <SearchIcon className="size-4 mr-2" /> Paste image URL
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert image URL</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Insert image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleImageUrlSubmit();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={handleImageUrlSubmit}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TextAlignButton = () => {
  const { editor } = useEditorStore();

  const alignments: { label: string; value: string; icon: LucideIcon }[] = [
    { label: 'Align Left', value: 'left', icon: AlignLeftIcon },
    { label: 'Align Center', value: 'center', icon: AlignCenterIcon },
    { label: 'Align Right', value: 'right', icon: AlignRightIcon },
    { label: 'Align Justify', value: 'justify', icon: AlignJustifyIcon },
  ];

  return (
    <div className="flex space-x-2">
      {alignments.map(({ label, value, icon: Icon }) => (
        <button
          key={label}
          onClick={() => editor?.chain().focus().setTextAlign(value).run()}
          className={cn(
            'h-7 min-w-7 shrink-0 flex  items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm',
            editor?.isActive({ textAlign: value }) && 'bg-neutral-200/80'
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
};

const ListButton = () => {
  const { editor } = useEditorStore();

  const lists = [
    {
      label: 'Bullet List',
      icon: ListIcon,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive('bulletList') && 'bg-neutral-200/80',
    },

    {
      label: 'Ordered List',
      icon: ListOrderedIcon,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: editor?.isActive('orderedList') && 'bg-neutral-200/80',
    },
  ];

  return (
    <div className="flex space-x-2">
      {lists.map(({ label, icon: Icon, onClick, isActive }) => (
        <button
          key={label}
          onClick={onClick}
          className={cn(
            'h-7 min-w-7 shrink-0 flex  items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm',
            isActive
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
};

export const Toolbar = () => {
  const { editor } = useEditorStore();

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    // Basic Functionality: Undo, Redo, Print, Spellcheck
    [
      {
        label: 'undo',
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: 'redo',
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run(),
      },
      {
        label: 'print',
        icon: PrinterIcon,
        onClick: () => window.print(),
      },
      {
        label: 'spellcheck',
        icon: SpellCheckIcon,
        onClick: () => {
          const current = editor?.view.dom.getAttribute('spellcheck');
          editor?.view.dom.setAttribute(
            'spellcheck',
            current === 'false' ? 'true' : 'false'
          );
        },
      },
    ],

    // Formating Functionality: Bold, Italic, Underline
    [
      {
        label: 'bold',
        icon: BoldIcon,
        isActive: editor?.isActive('bold'),
        onClick: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        label: 'italic',
        icon: ItalicIcon,
        isActive: editor?.isActive('italic'),
        onClick: () => editor?.chain().focus().toggleItalic().run(),
      },
      {
        label: 'underline',
        icon: UnderlineIcon,
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
      },
    ],

    // Commenting Functionality: Comments, Italic, Underline
    [
      {
        label: 'comments',
        icon: MessageSquarePlusIcon,
        isActive: false, //TODO
        onClick: () => console.log('TODO: Comment'),
      },
      {
        label: 'list todo',
        icon: ListTodoIcon,
        isActive: editor?.isActive('taskList'),
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
      },
      {
        label: 'remove formatting',
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];
  return (
    <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />

      <FontFamily />
      <HeadingLevelButton />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />

      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <TextColorButton />
      <TextHighlightButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <TextAlignButton />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />

      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <LinkButton />
      <ImageButton />
      <ListButton />
    </div>
  );
};
