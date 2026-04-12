import { AlertCircle, CircleCheck, FileX } from "lucide-react";
import Modal from "../ui/Modal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { normalizeIds } from "@/lib";
import Papa from "papaparse";

interface FailedNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FailedNewsEntry[];
}

export default function FailedNewsModal({
  isOpen,
  onClose,
  data,
}: FailedNewsModalProps) {
  const newData = normalizeIds(data);
  const csv = Papa.unparse(newData);
  const download = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Entries_result_${new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}.csv`,
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("file downloaded successfully");
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Entries Status"
      size="xl"
      classname="p-0"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        {newData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileX size={48} className="mb-3 opacity-50" />
            <p>No failed entries to display</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Filename
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newData.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {(entry.id ?? "").split("-")[0]}...
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {entry.filename}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        entry.status === "Failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800",
                      )}
                    >
                      {entry.status === "Failed" ? (
                        <AlertCircle size={14} />
                      ) : (
                        <CircleCheck size={14} />
                      )}
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {entry.comment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        {
          <span className="text-sm text-gray-600">
            Total failed entries:{" "}
            <span className="font-semibold text-gray-900">
              {data.filter((pre) => pre.status === "Failed").length}
            </span>
          </span>
        }
        <div className="flex gap-2">
          <button
            onClick={download}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
