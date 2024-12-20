'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState } from 'react';

interface FileContextValue {
  files: string[];
  currentIndex: number;
  goodList: string[];
  badList: string[];
  markAsGood: () => void;
  markAsBad: () => void;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

interface FileProviderProps {
  children: React.ReactNode;
  initialFiles: string[];
}

export const FileProvider: React.FC<FileProviderProps> = ({ children, initialFiles }) => {
  const [files] = useState<string[]>(initialFiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goodList, setGoodList] = useState<string[]>([]);
  const [badList, setBadList] = useState<string[]>([]);

  const changeCurrentIndex = (options: { increment?: number, number?: number }) => {
    const increment = options.increment;
    if (increment) {
      setCurrentIndex(prev => prev + increment);
    }
    const number = options.number ?? 0;
    if (number > 0 && number < files.length) {
      setCurrentIndex(number);
    }
  }

  const markAsGood = () => {
    if (currentIndex < files.length) {
      setGoodList(prev => [...prev, files[currentIndex]]);
      changeCurrentIndex({increment: 1})
    }
  };

  const markAsBad = () => {
    if (currentIndex < files.length) {
      setBadList(prev => [...prev, files[currentIndex]]);
      changeCurrentIndex({increment: 1})
    }
  };

  const value: FileContextValue = {
    files,
    currentIndex,
    goodList,
    badList,
    markAsGood,
    markAsBad,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};
