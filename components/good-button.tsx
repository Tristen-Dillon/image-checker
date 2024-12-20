'use client';

import { useFileContext } from '@/context/file-context';


export default function GoodButton() {
  const { markAsGood } = useFileContext();
  return (
    <div
      onClick={markAsGood}
      className="w-[10vw] min-w-[80px] h-full bg-green-600 text-white font-bold text-xl flex items-center justify-center cursor-pointer sticky top-5"
    >
      Good
    </div>
  );
}
