import axios from "axios";
import { apiRequest } from "./apiService";

const uploadSingleFile = async (file: File, id: string, module: string[]) => {
    // 1. Get presigned URL
    const res = await apiRequest(
        "post",
        `/upload/presigned-url?file_name=${file.name}&module=${module[0]}&ref_id=${id}`
    );

    const { file_key, upload_url } = res.response.response;

    // 2. Upload to S3
    await axios.put(upload_url, file, {
        headers: {
            "Content-Type": file.type,
        },
        responseType: "blob",
    });

    const newForm = new FormData();
    newForm.append("module", module[1]);
    newForm.append("record_id", id);
    newForm.append("file_path_attachment", file_key);

    await apiRequest("post", "upload/common/files", newForm);
};

export const uploadWithLimit = async (files: File[], id: string, module: string[], limit = 3) => {
    const results: any[] = [];
    let index = 0;

    const worker = async () => {
        while (index < files.length) {
            const currentIndex = index++;
            const file = files[currentIndex];

            try {
                const res = await uploadSingleFile(file, id, module);
                results[currentIndex] = res;
            } catch (err) {
                console.error("Failed:", file.name);
            }
        }
    };

    // run limited workers
    await Promise.all(Array.from({ length: limit }, worker));

    return results;
};