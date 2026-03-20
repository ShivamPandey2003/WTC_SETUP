import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";
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
  const {state} = useLocation()

  const { Attachment, isPending, error } = useGetAttachment(id as string, state.type as number, state.file_id as string);

  useEffect(() => {
    if (!Attachment) return;

    const loadPdf = async () => {
      setLoading(true);

      const pdf = await pdfjsLib.getDocument(Attachment as string).promise;

      const container = containerRef.current!;
      container.innerHTML = ""; // clear previous render

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        container.appendChild(canvas);

        await page.render({
          canvasContext: context,
          viewport,
          canvas,
        }).promise;
      }

      setLoading(false);
    };

    loadPdf();
  }, [Attachment]);

  if (error) {
      return (
        <div className="flex items-center justify-center h-[80vh]">
          <ErrorDisplay
            title="Attachment Error"
            message={String(
              error?.message ??
                error?.message
            )}
          />
        </div>
      );
    }

  return (
    <div className="flex flex-col items-center gap-6 py-6 relative w-full max-w-full overflow-auto">
      {(loading || isPending ) && (
        <div className="absolute flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-primary rounded-full" />
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(`flex flex-col gap-6`, loading ? "opacity-0" : "opacity-100")}
      />
    </div>
  );
};

export default AttachmentPdf;
