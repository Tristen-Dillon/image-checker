import { FC, useEffect, useRef } from 'react';
import {
  getDocument,
  GlobalWorkerOptions,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/legacy/build/pdf';

interface PdfViewerProps {
  src: string;
  className: string;
}

// Set the worker src
GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const PdfViewer: FC<PdfViewerProps> = ({ src, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      if (!src || !containerRef.current) return;

      const loadingTask = getDocument(src);
      const pdf: PDFDocumentProxy = await loadingTask.promise;

      const container = containerRef.current;
      container.innerHTML = ''; // Clear previous content

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page: PDFPageProxy = await pdf.getPage(pageNumber);
        const scale = 1;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue; // Just a safety check

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        container.appendChild(canvas);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      }
    };

    renderPdf();
  }, [src]);

  return <div className={className} ref={containerRef} />;
};

export default PdfViewer;
