import { Pencil, Trash2 } from "lucide-react";
import DeleteModel from "@/components/global/DeleteModel";
import {
  useAdminInfiniteProgramme,
  useDeleteSession,
  useGetCategoryAll,
} from "@/api/programme_design_api/Programme_design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setIsDeleting,
  setSelected,
  setSession,
} from "@/redux/ProgrammeDesignSlice";
import EditModal from "./EditModel";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { cn, formatDate } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";

const CustomTable = () => {
  const {
    AllProgramme,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    hasPreviousPage,
    fetchPreviousPage,
    status,
    error,
  } = useAdminInfiniteProgramme();
  const { DeleteSession, isPending: isDeleetSessionPending } =
    useDeleteSession();
  const { AllCategory, isPending } = useGetCategoryAll();
  const { isDeleting, selected, slectedDate } = useSelector(
    (state: RootState) => state.Programme_Design,
  );
  const dispatch = useDispatch<AppDispatch>();

  const NewValue = useMemo(() => {
    if (!AllProgramme) return [];
    const newData = AllProgramme.pages.flatMap((page) => page.response.data);
    if (!newData) return [];

    return newData;
  }, [AllProgramme]);

  useEffect(() => {
    if (NewValue.length === 0) return;
    dispatch(setSession(NewValue));
  }, [NewValue]);

  if (
    status === "pending" ||
    isPending ||
    isFetchingNextPage ||
    isFetchingPreviousPage
  ) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (error || status === "error") {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Table Error" message={error?.message as string} />
      </div>
    );
  }

  if (
    !AllProgramme ||
    NewValue.length === 0 ||
    !NewValue.filter((item) => formatDate(item.start_date) === slectedDate)
      .length
  ) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div>
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
              {NewValue.filter(
                (item) => formatDate(item.start_date) === slectedDate,
              ).map((item, index) => (
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
                        AllCategory?.response.map((i: any) => [i.id, i]),
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
        {hasNextPage && (
          <div className="flex items-center gap-4 justify-end w-full">
            <Button
              disabled={!hasPreviousPage}
              onClick={() => fetchPreviousPage()}
              className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Previous
            </Button>
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage}
              className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Next
            </Button>
          </div>
        )}
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
