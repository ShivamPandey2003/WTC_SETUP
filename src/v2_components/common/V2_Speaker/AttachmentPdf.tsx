import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef } from "react";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

type Props = {
  url: string;
};

const PdfPreview = ({ url }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 0.6 });

      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d")!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
        canvas: canvas,
      }).promise;
    };

    renderPdf();
  }, [url]);

  return (
    <canvas ref={canvasRef} className="w-full h-64 object-cover bg-white" />
  );
};

export default PdfPreview;
