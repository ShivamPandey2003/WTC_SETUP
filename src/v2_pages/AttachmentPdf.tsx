import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef, useState, useCallback } from "react";
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
import { useLocation, useParams } from "react-router";
import { useGetAttachment } from "@/api/programme_design_api/Programme_design_api";
import { cn } from "@/lib/utils";
import ErrorDisplay from "@/components/global/ErrorDisplay";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const AttachmentPdf = () => {
  const { id } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();

  const { Attachment, isPending, error } = useGetAttachment(
    id as string,
    state.type as number,
    state.file_id as string
  );

  const renderPdf = useCallback(async () => {
    if (!Attachment || !containerRef.current) return;

    setLoading(true);
    const container = containerRef.current;
    
    try {
      const pdf = await pdfjsLib.getDocument(Attachment as string).promise;
      container.innerHTML = ""; // Clear previous render

      // Get container width for responsiveness
      const containerWidth = container.clientWidth;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // 1. Calculate dynamic scale
        // We want the PDF width to match the container width
        const unscaledViewport = page.getViewport({ scale: 1 });
        const dynamicScale = containerWidth / unscaledViewport.width;
        
        // Ensure it doesn't get too small or unnecessarily huge
        const finalScale = Math.min(dynamicScale, 2); 
        const viewport = page.getViewport({ scale: finalScale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;

        // 2. Adjust for High DPI (Retina) screens
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : undefined;

        container.appendChild(canvas);

        await page.render({
          canvasContext: context,
          viewport,
          canvas: canvas,
          transform: transform as any,
        }).promise;
      }
    } catch (err) {
      console.error("PDF Render Error:", err);
    } finally {
      setLoading(false);
    }
  }, [Attachment]);

  // Handle Initial Load
  useEffect(() => {
    renderPdf();
  }, [renderPdf]);

  // Handle Resize (Debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        renderPdf();
      }, 300); // Wait 300ms after resize ends to re-render
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderPdf]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay
          title="Attachment Error"
          message={String(error?.message)}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-gray-100 min-h-screen overflow-x-hidden">
      {(loading || isPending) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-primary rounded-full" />
        </div>
      )}

      {/* This is the critical responsive wrapper:
        - px-4 adds breathing room on mobile
        - max-w-4xl prevents the PDF from being too huge on ultra-wide monitors
      */}
      <div
        ref={containerRef}
        className={cn(
          "w-full max-w-4xl px-2 md:px-4 flex flex-col gap-4 py-4 transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
};

export default AttachmentPdf;