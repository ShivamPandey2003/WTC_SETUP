import { CircleUserRound, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const CustomTable = () => {
  const [data] = useState([
    {
      id: 1,
      title: "New Amendments",
      Description: "Lorem Ipsum is simply dummy text ...",
      "Created On": "Oct 12, 2025",
      "Tile Space": "x2",
    },
    {
      id: 2,
      title: "New Amendments",
      Description: "Lorem Ipsum is simply dummy text ...",
      "Created On": "Oct 12, 2025",
      "Tile Space": "x2",
    },
    {
      id: 3,
      title: "New Amendments",
      Description: "Lorem Ipsum is simply dummy text ...",
      "Created On": "Oct 12, 2025",
      "Tile Space": "x2",
    },
    {
      id: 4,
      title: "New Amendments",
      Description: "Lorem Ipsum is simply dummy text ...",
      "Created On": "Oct 12, 2025",
      "Tile Space": "x2",
    },
    {
      id: 5,
      title: "New Amendments",
      Description: "Lorem Ipsum is simply dummy text ...",
      "Created On": "Oct 12, 2025",
      "Tile Space": "x2",
    },
  ]);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate" style={{ borderSpacing: "0 8px" }}>
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
                Created On
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tile Space
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="bg-gray-50 border">
                <td className="px-6 py-2 rounded-[8px]">{item.id}</td>
                <td className="px-6 py-2">{item.title}</td>
                <td className="px-6 py-2">{item.Description}</td>
                <td className="px-6 py-2">{item["Created On"]}</td>
                <td className="px-6 py-2">
                  <CircleUserRound className="ml-[1rem]" />
                </td>
                <td className="px-6 py-2">{item["Tile Space"]}</td>
                <td className="px-6 py-2 flex gap-2 rounded-[8px]">
                  <Pencil
                    color="#425EBC"
                    size={18}
                    className="cursor-pointer"
                  />
                  <Trash2
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
    </div>
  );
};

export default CustomTable;
