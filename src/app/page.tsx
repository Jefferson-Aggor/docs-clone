import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Link href={'/documents/123'}>
        <Button variant={'link'}>Go to document ID</Button>
      </Link>
    </div>
  );
};

export default Home;
