import { Pencil, Trash2 } from "lucide-react";
import DeleteModel from "@/components/global/DeleteModel";
import {
  useDeleteSession,
  useGetCategoryAll,
  useGetSessionList,
} from "@/api/programme_design_api/Programme_design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setIsDeleting, setSelected } from "@/redux/ProgrammeDesignSlice";
import EditModal from "./EditModel";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { formatDate } from "@/lib/utils";

const CustomTable = () => {
  const {
    SessionList,
    isPending: isSessionListPending,
    error: errorInSessionList,
  } = useGetSessionList();
  const { DeleteSession, isPending: isDeleetSessionPending } =
    useDeleteSession();
  const { AllCategory, isPending } = useGetCategoryAll();
  const { isDeleting, selected, slectedDate } = useSelector(
    (state: RootState) => state.Programme_Design
  );
  const dispatch = useDispatch<AppDispatch>();

  if (isSessionListPending || isPending) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (errorInSessionList) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay
          title="Table Error"
          message={errorInSessionList.message}
        />
      </div>
    );
  }

  if (
    !SessionList ||
    !SessionList.response ||
    !SessionList.response.filter(
      (item) => formatDate(item.start_date) === slectedDate
    ).length
  ) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
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
            {SessionList.response
              .filter((item) => formatDate(item.start_date) === slectedDate)
              .map((item, index) => (
                <tr key={item.session_id} className="bg-white border">
                  <td className="px-6 py-2">{index + 1}</td>
                  <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
                    {item.title}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[320px]">
                    {item.description}
                  </td>
                  <td className="px-6 py-2">{item.start_time}</td>
                  <td className="px-6 py-2">{item.end_time}</td>
                  <td className="px-6 py-2">
                      {item.category.map((id) => {
                        const Aray: any = new Map(
                          AllCategory?.response.map((i: any) => [i.id, i])
                        );
                        return Aray.get(id).name;
                      })}
                  </td>
                  <td className="px-6 py-2 flex gap-2">
                    <Pencil
                      onClick={() => dispatch(setSelected(item.session_id))}
                      color="#425EBC"
                      size={18}
                      className="cursor-pointer"
                    />
                    <Trash2
                      onClick={() => dispatch(setIsDeleting(item.session_id))}
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
      <EditModal
        isOpen={Boolean(selected)}
        onClose={() => dispatch(setSelected(null))}
      />
      <DeleteModel
        isOpen={Boolean(isDeleting)}
        onClose={() => dispatch(setIsDeleting(null))}
        onConfirm={() => DeleteSession({ id: isDeleting as string })}
        isDeleting={isDeleetSessionPending}
      />
    </div>
  );
};

export default CustomTable;
