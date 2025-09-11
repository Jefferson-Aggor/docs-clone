import { Button } from '@/components/ui/button';
import { RemoveDialog } from '@/components/remove-dialog';
import { RenameDialog } from '@/components/rename-dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ExternalLinkIcon,
  FilePenIcon,
  MoreVerticalIcon,
  TrashIcon,
} from 'lucide-react';

import { Id } from '../../../convex/_generated/dataModel';
import { toast } from 'sonner';

interface DocumentDropdownMenuProps {
  documentId: Id<'documents'>;
  title: string;
  isAllowed: boolean;
  onNewTab: (id: Id<'documents'>) => void;
}

export const DocumentDropdownMenu = ({
  documentId,
  title,
  isAllowed,
  onNewTab,
}: DocumentDropdownMenuProps) => {
  const handleError = (msg: string) => {
    toast.error(msg);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size="icon" className="rounded-full">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        {isAllowed ? (
          <RenameDialog documentId={documentId} title={title}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <FilePenIcon className="size-4 mr-2 fill" /> Rename
            </DropdownMenuItem>
          </RenameDialog>
        ) : (
          <DropdownMenuItem
            onClick={() => handleError('Action not authorized')}
            className="text-muted-foreground cursor-not-allowed"
          >
            <FilePenIcon className="size-4 mr-2 fill" /> <p>Rename</p>
          </DropdownMenuItem>
        )}

        {isAllowed ? (
          <RemoveDialog documentId={documentId}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <TrashIcon className="size-4 mr-2 fill" /> Delete
            </DropdownMenuItem>
          </RemoveDialog>
        ) : (
          <DropdownMenuItem
            onClick={() => handleError('Action not authorized')}
            className="text-muted-foreground cursor-not-allowed"
          >
            <TrashIcon className="size-4 mr-2 fill" /> Delete
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => onNewTab(documentId)}>
          <ExternalLinkIcon className="size-4 mr-2" />
          Open in a new tab
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
