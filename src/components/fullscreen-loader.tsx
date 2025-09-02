import { LoaderIcon } from 'lucide-react';

interface FullScreenLoaderProps {
  label?: string;
}
export const FullScreenLoader = ({ label }: FullScreenLoaderProps) => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};
