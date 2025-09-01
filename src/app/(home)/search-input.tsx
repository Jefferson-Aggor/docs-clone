'use client';
import { useRef, useState } from 'react';
import { useSearchParam } from '@/hooks/use-search-param';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, XIcon } from 'lucide-react';

export const SearchInput = () => {
  const [search, setSearch] = useSearchParam();
  const [value, setValue] = useState(search);

  const inputRef = useRef<HTMLInputElement>(null);

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    setSearch('');
    inputRef.current?.blur();
  };

  const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(value);
    inputRef.current?.blur();
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <form onSubmit={onSubmit} className="relative max-w-[720px] w-full">
        <Input
          value={value}
          ref={inputRef}
          onChange={onHandleChange}
          placeholder="Search"
          className="md:text-base placeholder:text-neutral-800 px-14 w-full border-none focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_1px_rgba(65,69,73,.15)] bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white"
        />
        <Button
          type="submit"
          variant={'ghost'}
          size={'icon'}
          className="absolute top-1/2 -translate-y-1/2 left-3 [&_svg]:size-5 rounded-full"
        >
          <SearchIcon />
        </Button>
        {value && (
          <Button
            onClick={handleClear}
            type="button"
            variant={'ghost'}
            size={'icon'}
            className="absolute top-1/2 -translate-y-1/2 right-3 [&_svg]:size-5 rounded-full"
          >
            <XIcon />
          </Button>
        )}
      </form>
    </div>
  );
};
