import { Pencil, Trash2 } from "lucide-react";
import DeleteModel from "@/components/global/DeleteModel";
import { useState } from "react";

const CustomTable = () => {
  const dateCustom = (datestr: string) => {
    const time = new Date(datestr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return time;
  };

  const newData = [
    {
      sno: 3,
      session_id: "3gBZcXmK7ZTPr",
      title: "New Title",
      category: "some category",
      location: "New Delhi",
      start_time: "2025-11-10T09:00:00+05:30",
      end_time: "2025-11-10T17:00:00+05:30",
      speakers: ["John Doe", "Priya Mehta", "Alex Chen"],
      attachments: [
        "uploads/session_attachments\\session_attach_20251029102644908724_3c68f183cbd6.png",
      ],
      external_link: "https://www.wtcconference.com/summit2026",
      description: "Nw",
      created_on: "2025-10-29T10:26:44.917512+05:30",
    },
    {
      sno: 1,
      session_id: "ANguLsCtReB5gz",
      title: "WTC Annual Tech Summit 2025",
      category: "Technical",
      location: "WTC Conference Hall, Bengaluru",
      start_time: "2025-11-10T09:00:00+05:30",
      end_time: "2025-11-10T17:00:00+05:30",
      speakers: ["John Doe", "Priya Mehta", "Alex Chen"],
      attachments: [
        "uploads/session_attachments\\session_attach_20251029095743984939_d71a999e1146.png",
      ],
      external_link: "https://www.wtcconference.com/summit2025",
      description:
        "The WTC Annual Tech Summit focuses on innovation, AI, and emerging technologies shaping the future of global commerce.",
      created_on: "2025-10-29T09:57:43.989689+05:30",
    },
  ];

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="min-w-full border-separate"
          style={{ borderSpacing: "0 8px" }}
        >
          <thead className="">
            <tr>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sno.
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Starts
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ends
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {newData.map((item, index) => (
              <tr key={item.session_id} className="bg-gray-50 border">
                <td className="px-6 py-2 rounded-[8px]">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
                  {item.title}
                </td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[320px]">
                  {item.description}
                </td>
                <td className="px-6 py-2">{dateCustom(item.start_time)}</td>
                <td className="px-6 py-2">{dateCustom(item.end_time)}</td>
                <td className="px-6 py-2">{item.category}</td>
                <td className="px-6 py-2 flex gap-2 rounded-[8px]">
                  <Pencil
                    color="#425EBC"
                    size={18}
                    className="cursor-pointer"
                  />
                  <Trash2
                  onClick={()=>setIsDeleteOpen(true)}
                    color="#B85555"
                    size={18}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteModel
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {}}
        itemName="Important Document"
        isDeleting={false}
      />
    </div>
  );
};

export default CustomTable;
