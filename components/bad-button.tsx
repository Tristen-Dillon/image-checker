'use client';

import { useFileContext } from '@/context/file-context';


export default function BadButton() {
  const { markAsBad } = useFileContext();
  return (
    <div
      onClick={markAsBad}
      className="w-[10vw] min-w-[80px] h-full bg-red-600 text-white font-bold text-xl flex items-center justify-center cursor-pointer sticky top-5"
    >
      Bad
    </div>
  );
}
