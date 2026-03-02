import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const AttachmentPdf = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchpage] = useSearchParams();

  const url = searchpage.get("url");

  useEffect(() => {
    const loadPdf = async () => {
      const pdf = await pdfjsLib.getDocument(url as string).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d")!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport,
        canvas: canvas,
      }).promise;
    };

    loadPdf();
  }, [url]);

  return <canvas ref={canvasRef} />;
};

export default AttachmentPdf;
