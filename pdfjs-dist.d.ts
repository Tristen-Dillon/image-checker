declare module 'pdfjs-dist/legacy/build/pdf' {
  // Interface for PDF page viewport
  interface PDFPageViewport {
    width: number;
    height: number;
    scale: number;
    rotation: number;
    transform: number[];
    viewBox: number[];
    clone(scale?: number, rotation?: number): PDFPageViewport;
  }

  // Interface for each PDF page
  interface PDFPageProxy {
    getViewport(params: { scale: number; rotation?: number }): PDFPageViewport;
    render(params: { canvasContext: CanvasRenderingContext2D; viewport: PDFPageViewport }): { promise: Promise<void> };
    pageNumber: number;
    rotate: number;
    // Additional properties/methods can be declared as needed
  }

  // Interface for the PDF document
  interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    // Additional methods as needed
  }

  // Interface for the loading task
  interface PDFLoadingTask<T> {
    promise: Promise<T>;
  }

  // getDocument function
  function getDocument(src: string | Uint8Array | { data: Uint8Array }): PDFLoadingTask<PDFDocumentProxy>;

  // Global worker options
  namespace GlobalWorkerOptions {
    let workerSrc: string;
  }

  export { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy, PDFPageViewport, PDFLoadingTask };
}
