import { Button } from '@/components/ui/button';
import { RemoveDialog } from '@/components/remove-dialog';
import { RenameDialog } from '@/components/rename-dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ExternalLinkIcon,
  FilePenIcon,
  MoreVerticalIcon,
  TrashIcon,
} from 'lucide-react';

import { Id } from '../../../convex/_generated/dataModel';

interface DocumentDropdownMenuProps {
  documentId: Id<'documents'>;
  title: string;
  onNewTab: (id: Id<'documents'>) => void;
}

export const DocumentDropdownMenu = ({
  documentId,
  title,
  onNewTab,
}: DocumentDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size="icon" className="rounded-full">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        <RenameDialog documentId={documentId} title={title}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FilePenIcon className="size-4 mr-2 fill" /> Rename
          </DropdownMenuItem>
        </RenameDialog>

        <RemoveDialog documentId={documentId}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <TrashIcon className="size-4 mr-2 fill" /> Delete
          </DropdownMenuItem>
        </RemoveDialog>

        <DropdownMenuItem onClick={() => onNewTab(documentId)}>
          <ExternalLinkIcon className="size-4 mr-2" />
          Open in a new tab
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
