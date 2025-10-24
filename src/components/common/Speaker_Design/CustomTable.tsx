import Linkedin from "@/assets/Icons/Linkedin";
import { Pencil, Trash2 } from "lucide-react";
import Speaker from "@/data/Speaker";
import Keynote from "@/assets/Icons/Keynote";

const CustomTable = () => {

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
                Full Name
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bio
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LinkedIn
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Picture
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keynote
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Speaker.map((item, index) => (
              <tr key={index} className="bg-gray-50 border">
                <td className="px-6 py-2 rounded-[8px]">{index}</td>
                <td className="px-6 py-2">{item.name}</td>
                <td className="px-6 py-2">{item.description}</td>
                <td className="pl-9 py-2"><Linkedin size={20} /></td>
                <td className="pl-9 py-2">
                    <img src={item.image} className="w-[24px] h-[24px]" />
                </td>
                <td className="pl-12 py-2"><Keynote size={20} className="text-primary"/></td>
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
