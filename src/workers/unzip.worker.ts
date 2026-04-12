/// <reference lib="webworker" />

import JSZip from "jszip";

self.onmessage = async (e: MessageEvent) => {
  const file = e.data;

  try {
    const zip = await JSZip.loadAsync(file);

    const extractedFiles: any[] = [];

    for (const filename in zip.files) {
      const zipEntry = zip.files[filename];

      if (!zipEntry.dir) {
        const blob = await zipEntry.async("blob");

        extractedFiles.push({
          name: filename,
          blob,
        });
      }
    }

    self.postMessage({ success: true, files: extractedFiles });
  } catch (err) {
    self.postMessage({ success: false, error: err });
  }
};

export const unzipWithWorker = (file: File): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../workers/unzip.worker.ts", import.meta.url),
      { type: "module" }
    );

    worker.postMessage(file);

    worker.onmessage = (e) => {
      const { success, files, error } = e.data;

      if (success) {
        const result = files.map(
          (f: any) =>
            new File([f.blob], f.name, {
              type: f.blob.type,
            })
        );

        resolve(result);
      } else {
        reject(error);
      }

      worker.terminate();
    };
  });
};