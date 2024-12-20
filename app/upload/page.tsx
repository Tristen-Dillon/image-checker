'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
      setProgress(0);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    setUploading(true);
    setMessage('');

    const allFiles = Array.from(selectedFiles);
    const total = allFiles.length;
    let count = 0;

    // Function to upload a single chunk of files
    const uploadChunk = async (chunk: File[]) => {
      const formData = new FormData();
      for (const file of chunk) {
        formData.append(file.name, file);
      }
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      return res;
    };

    // Process files in steps (chunks) of 5
    const chunkSize = 50;
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = allFiles.slice(i, i + chunkSize);
      const res = await uploadChunk(chunk);

      if (res.ok) {
        count += chunk.length;
        setProgress((count / total) * 100);
      } else {
        // If the upload for this chunk fails, set an error and break
        setMessage('Upload failed on a chunk!');
        setUploading(false);
        return;
      }
    }

    setMessage('Upload complete!');
    setUploading(false);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl mb-4">Upload Files</h1>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        // Casting to `any` for webkitdirectory as TypeScript doesn't have a definition for this attribute
        {...({ webkitdirectory: 'true', directory: 'true' })}
        className="mb-4 border p-2"
      />

      {selectedFiles && (
        <div className="mb-4">
          <p>{selectedFiles.length} files selected.</p>
          {!uploading && (
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Start Upload
            </button>
          )}
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 h-5 relative mb-4">
          <div
            className="bg-blue-500 h-full transition-width duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {message && <p className="text-lg">{message}</p>}
    </div>
  );
}
