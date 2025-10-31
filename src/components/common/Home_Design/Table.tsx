import { CircleUserRound, Pencil, Trash2, Upload } from "lucide-react";
import DeleteModel from "../../global/DeleteModel";
import UploadModal from "@/components/global/UploadModel";
import { useState } from "react";
import EditModal from "./EditModal";
import News from "@/data/News";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setSelected } from "@/redux/HomeDesignSlice";

const CustomTable = () => {

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isPublishOpen, setIsPublishOpen] = useState<boolean>(false);
  const {selected} = useSelector((state:RootState)=>state.Home_Design)
  const dispatch = useDispatch<AppDispatch>();

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
            {News.map((item, index) => (
              <tr key={item.id} className="bg-gray-50 border">
                <td className="px-6 py-2 rounded-[8px]">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
                  {item.title}
                </td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[350px]">
                  {item.description}
                </td>
                <td className="px-6 py-2">{item["Created On"]}</td>
                <td className="px-6 py-2">
                  <CircleUserRound className="ml-[1.4rem]" />
                </td>
                <td className="px-6 py-2">
                  <div className="ml-[1.4rem]">{item.tile_space}</div>
                </td>
                <td className="px-6 py-2 flex gap-3 rounded-[8px]">
                  <Pencil
                    onClick={() => dispatch(setSelected(item.id))}
                    color="#425EBC"
                    size={18}
                    className="cursor-pointer"
                  />
                  <Trash2
                    onClick={() => setIsDeleteOpen(true)}
                    color="#B85555"
                    size={18}
                    className="cursor-pointer"
                  />
                  {!item.is_published && (
                    <Upload
                      onClick={() => setIsPublishOpen(true)}
                      size={18}
                      className="cursor-pointer"
                    />
                  )}
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
      <UploadModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onConfirm={() => {}}
        itemName="Important Document"
        isAction={false}
      />
      <EditModal isOpen={Boolean(selected)} onClose={() => dispatch(setSelected(null))} />
    </div>
  );
};

export default CustomTable;
