import Image from 'next/image';
import Link from 'next/link';
import { SearchInput } from './search-input';

import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-full w-full ">
      <div className="shrink-0 pr-6">
        <Link href={'/'} className="flex gap-3 items-center">
          <Image src={'/logo.svg'} alt="" height={36} width={36} />
          <h3 className="text-xl">Docs</h3>
        </Link>
      </div>
      <SearchInput />
      <div className="flex items-center gap-x-3 pl-6">
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
