import { CircleX, Pencil, SquareCheck, Trash2 } from "lucide-react";
import React from "react";
import { CategoryColor, cn } from "@/lib/utils";

const CustomTable = () => {
  const [data] = React.useState([
    {
      name: "Epiroc",
      url: "https://epiroc.com",
      email: "info@epiroc.com",
      logo: true,
      category: "Diamond",
      ads: false,
    },
    {
      name: "Epiroc",
      url: "https://epiroc.com",
      email: "info@epiroc.com",
      logo: true,
      category: "Platinum",
      ads: false,
    },
    {
      name: "Epiroc",
      url: "https://epiroc.com",
      email: "info@epiroc.com",
      logo: false,
      category: "Gold",
      ads: true,
    },
    {
      name: "Epiroc",
      url: "https://epiroc.com",
      email: "info@epiroc.com",
      logo: true,
      category: "Platinum",
      ads: false,
    },
    {
      name: "Epiroc",
      url: "https://epiroc.com",
      email: "info@epiroc.com",
      logo: true,
      category: "Diamond",
      ads: true,
    },
  ]);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="min-w-full border-separate"
          style={{ borderSpacing: "0 8px" }}
        >
          <thead className="">
            <tr>
              <th className="pl-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sno.
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exhibitor Name
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logo
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ads
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="bg-gray-50 border">
                <td className="pl-3 py-2 rounded-[8px]">{index}</td>
                <td className="pl-6 py-2">{item.name}</td>
                <td className="pl-6 py-2">{item.url}</td>
                <td className="pl-6 py-2">{item.email}</td>
                <td className="pl-6 py-2">
                  {item.logo && (
                    <SquareCheck
                      fill="#318061"
                      className="border-[#318061] text-white"
                      size={28}
                    />
                  )}
                </td>
                <td className="pl-2 py-2">
                  <div
                    className={cn(
                      "w-[100px] h-[20px] rounded-[7px] text-xs flex items-center justify-center mr-2 text-white",
                      CategoryColor(item.category)
                    )}
                  >
                    {item.category}
                  </div>
                </td>
                <td className="pl-6 py-2">
                  {item.ads ? (
                    <SquareCheck
                      fill="#318061"
                      className="border-[#318061] text-white"
                      size={28}
                    />
                  ) : (
                    <CircleX
                      fill="#CDA4A4"
                      className="border-[#CDA4A4] text-white"
                      size={28}
                    />
                  )}
                </td>
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
