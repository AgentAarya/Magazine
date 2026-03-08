import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFReader({ fileUrl }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState(850);

  useEffect(() => {
    const updateWidth = () => {
      const viewport = window.innerWidth;
      if (viewport < 480) setWidth(300);
      else if (viewport < 768) setWidth(420);
      else if (viewport < 1024) setWidth(600);
      else setWidth(850);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <section className="card p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button className="btn-secondary" onClick={() => setPageNumber((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <button className="btn-secondary" onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}>
          Next
        </button>
        <span className="text-sm">
          Page {pageNumber} / {numPages || '--'}
        </span>
        <button className="btn-secondary" onClick={() => document.documentElement.requestFullscreen?.()}>
          Fullscreen
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white p-3">
        <Document file={fileUrl} onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}>
          <Page pageNumber={pageNumber} width={width} />
        </Document>
      </div>
    </section>
  );
}
