"use client";

import { useFileContext } from '@/context/file-context';
import { useState, type JSX, useEffect, useCallback } from 'react';
import BadButton from './bad-button';
import GoodButton from './good-button';
import { MasonryItem } from './masonry-item';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/pdf-viewer'), {
  ssr: false,
});

export default function ViewerComponent() {
  const { files, currentIndex, goodList, badList, markAsBad, markAsGood } = useFileContext();
  const [fileView, setFileView] = useState<JSX.Element | null>(null);
  const [nextFileView, setNextFileView] = useState<JSX.Element | null>(null);

  const [lastKeyStroke, setLastKeyStroke] = useState<number>(Date.now())

  const goodProgress = goodList.length / (files.length + 1) * 100;
  const badProgress = badList.length / (files.length + 1) * 100
  const progress = goodProgress + badProgress
  const goodKey = 'g';
  const badKey = 'b';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if keys match
    if (Date.now() - lastKeyStroke < 300) {
      return;
    }
    if (e.key.toLowerCase() === goodKey && goodKey && currentIndex < files.length) {
      markAsGood();
    } else if (e.key.toLowerCase() === badKey && currentIndex < files.length) {
      markAsBad();
    }
    setLastKeyStroke(Date.now())
  }, [goodKey, badKey, currentIndex, files.length, markAsGood, markAsBad]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  function getFileView(src: string | null) {
    if (!src) {
      return null;
    }
    const ext = src.toLowerCase().split('.').pop();
    const fileUrl = `/files/${src}`;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext!)) {
      // Use next/image for the current image
      return (
        <div className="relative w-[60%] h-[80%] flex justify-center">
          <MasonryItem src={fileUrl} />
        </div>
      );
    } else if (ext === 'pdf') {
      return (
        <PdfViewer
          src={fileUrl}
          className="border-none h-full mt-44"
        />
      );
    } else {
      return null;
    }
  }

  useEffect(() => {
    const currentFile = currentIndex < files.length ? files[currentIndex] : null;
    const nextFile = currentIndex + 1 < files.length ? files[currentIndex + 1] : null;
    if (nextFileView) {
      setFileView(nextFileView)
      setNextFileView(null)
    }
    if (!currentFile) {
      setFileView(null);
      return;
    }
    if (!nextFile) {
      setNextFileView(null);
    }

    if (!fileView) {
      const current = getFileView(currentFile);
      setFileView(current);
    }

    const next = getFileView(nextFile);
    setNextFileView(next);
  }, [currentIndex]);

  const downloadList = (list: string[], filename: string) => {
    const blob = new Blob([list.join('\n')], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex flex-col h-screen overflow-none m-0">
      <div className="flex items-start justify-between p-5 box-border gap-5 flex-1 h-full relative z-50">
        <div className="absolute top-0 w-screen py-10 px-[20%]">
          <div className="w-full h-10 rounded-xl bg-gray-600 flex text-center items-center relative">
            <p className="text-center w-full">{currentIndex + 1} / {files.length + 1} {progress.toFixed(2)}%</p>
            <div className="absolute w-full left-0 h-10 rounded-l-xl flex">
              <div style={{width: `${goodProgress}%`}} className="bg-green-500 h-10 rounded-l-xl"></div>
              <div style={{width: `${badProgress}%`}} className="bg-red-500 h-10"></div>
            </div>
          </div>
        </div>
        <GoodButton />

        <div className="flex flex-col items-center gap-5 relative flex-1 h-full">
          <div id="viewer" className="flex items-center justify-center w-full h-full overflow-none">
            {fileView}
            <div hidden>{nextFileView}</div>
          </div>
          <div
            id="message"
            className="text-center text-lg"
          >
            {currentIndex >= files.length && files.length > 0 && "No more files to review."}
            {files.length === 0 && "No files found."}
          </div>

          <div
            id="downloadButtons"
            className={`text-center mt-5`}
          >
            {goodList.length > 0 &&
              <button
                onClick={() => {
                  if (goodList.length > 0) downloadList(goodList, 'good.txt');
                  else alert('No items marked as Good yet.');
                }}
                className="m-2 p-2 bg-blue-500 text-white rounded"
              >
                Download Good.txt
              </button>
            }
            {badList.length > 0 &&

              <button
                onClick={() => {
                  if (badList.length > 0) downloadList(badList, 'bad.txt');
                  else alert('No items marked as Bad yet.');
                }}
                className="m-2 p-2 bg-blue-500 text-white rounded"
              >
                Download Bad.txt
              </button>
            }
          </div>
        </div>

        <BadButton />
      </div>
    </div>
  );
}