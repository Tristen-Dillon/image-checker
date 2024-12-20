'use client';

import React, { createContext, useContext, useState } from 'react';

interface FileContextValue {
  files: File[];
  currentIndex: number;
  goodList: string[];
  badList: string[];
  handleFileChange: (files: FileList) => void;
  markAsGood: () => void;
  markAsBad: () => void;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

export const FileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goodList, setGoodList] = useState<string[]>([]);
  const [badList, setBadList] = useState<string[]>([]);

  const handleFileChange = (fileList: FileList) => {
    const selectedFiles = Array.from(fileList);

    const images = selectedFiles.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext!);
    });
    const pdfs = selectedFiles.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ext === 'pdf';
    });

    const combined = images.concat(pdfs);
    setFiles(combined);
    setCurrentIndex(0);
    setGoodList([]);
    setBadList([]);
  };

  const markAsGood = () => {
    if (currentIndex < files.length) {
      setGoodList(prev => [...prev, files[currentIndex].name]);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const markAsBad = () => {
    if (currentIndex < files.length) {
      setBadList(prev => [...prev, files[currentIndex].name]);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const value: FileContextValue = {
    files,
    currentIndex,
    goodList,
    badList,
    handleFileChange,
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
