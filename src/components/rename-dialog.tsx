'use client';
import { useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RenameDialogProps {
  documentId: Id<'documents'>;
  title: string;
  children: React.ReactNode;
}

export const RenameDialog = ({
  documentId,
  title,
  children,
}: RenameDialogProps) => {
  const update = useMutation(api.documents.updateById);
  const [isUpdating, setIsUpdating] = useState(false);
  const [value, setValue] = useState(title);
  const [open, setOpen] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    update({ documentId, title: value.trim() || 'Untitled' })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsUpdating(false);
        setOpen(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rename document</DialogTitle>
            <DialogDescription>
              Enter a new name for this document
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Document name"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant={'ghost'}
              disabled={isUpdating}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              onClick={(e) => e.stopPropagation()}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
