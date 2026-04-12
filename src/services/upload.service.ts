import { apiRequest } from "./apiService";

// type PresignedRequest = {
//   file_name: string;
//   content_type: string;
// };

type PresignedResponse = {
  url: string;
  key: string;
};

const getContentType = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",

    pdf: "application/pdf",
    txt: "text/plain",
    json: "application/json",

    mp4: "video/mp4",
    mp3: "audio/mpeg",

    zip: "application/zip",
  };

  return mimeTypes[ext || ""] || "application/octet-stream";
};

export const getPresignedUrls = async (
  files: File[],
  type:number
): Promise<PresignedResponse[]> => {
  const payload = files.map((file) => {
//     return ({
//     file_name: file.name,
//     content_type: file.type || getContentType(file.name) || "application/octet-stream",
//   })}

  return file.type || getContentType(file.name) || "application/octet-stream"
  }
);

  const res = await apiRequest("post",`/upload/presigned-urls/bulk?type=${type}`, payload);

  return res.data.data;
};