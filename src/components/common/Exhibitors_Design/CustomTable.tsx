import { CircleX, Pencil, SquareCheck, Trash2 } from "lucide-react";
import { CategoryColor, cn } from "@/lib/utils";
import {
  useDeleteExibitor,
  useGetExhibitorsList,
} from "@/api/exhibitor_design_api/exhibitor_design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setIsDeleting, setSelected } from "@/redux/ExhibitorSlice";
import DeleteModel from "@/components/global/DeleteModel";
import EditModal from "./EditModel";

const CustomTable = () => {
  const { isExhibitorsPending, errorInError } = useGetExhibitorsList();
  const { isDeleting, selected, Exhibitors } = useSelector(
    (state: RootState) => state.ExhibitorSlice
  );
  const dispatch = useDispatch<AppDispatch>();
  const { DeleteExibitor, isPending: isDeletingPending } = useDeleteExibitor();

  if (isExhibitorsPending || !Exhibitors) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (errorInError) {
    return <div>{errorInError.message}</div>;
  }

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
            {Exhibitors.map((item, index) => (
              <tr key={index} className="bg-gray-50 border">
                <td className="pl-3 py-2 rounded-lg">{index + 1}</td>
                <td className="pl-6 py-2">{item.full_name}</td>
                <td className="pl-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                  {item.url}
                </td>
                <td className="pl-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]">
                  {item.email}
                </td>
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
                      "w-[100px] h-5 rounded-[7px] text-xs flex items-center justify-center mr-2 text-white",
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
                <td className="px-6 py-2 flex gap-2 rounded-lg">
                  <Pencil
                    color="#425EBC"
                    onClick={() => dispatch(setSelected(item.id))}
                    size={18}
                    className="cursor-pointer"
                  />
                  <Trash2
                    color="#B85555"
                    onClick={() => dispatch(setIsDeleting(item.id))}
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
        isOpen={Boolean(isDeleting)}
        onClose={() => dispatch(setIsDeleting(null))}
        onConfirm={() => DeleteExibitor({ id: isDeleting as string })}
        isDeleting={isDeletingPending}
      />
      <EditModal
        isOpen={Boolean(selected)}
        onClose={() => dispatch(setSelected(null))}
      />
    </div>
  );
};

export default CustomTable;
