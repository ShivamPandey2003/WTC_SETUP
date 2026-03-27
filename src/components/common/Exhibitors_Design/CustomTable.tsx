import { CircleX, Pencil, SquareCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useDeleteExibitor,
  useGetExhibitorsList,
} from "@/api/exhibitor_design_api/exhibitor_design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setExhibitors,
  setIsDeleting,
  setSelected,
} from "@/redux/ExhibitorSlice";
import DeleteModel from "@/components/global/DeleteModel";
import EditModal from "./EditModel";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { useGetCategoryAll } from "@/api/programme_design_api/Programme_design_api";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";

const CustomTable = () => {
  const [page, setPage] = useState<number>(1);
  const { isDeleting, selected, searchText } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );
  const { errorInError, Exhibitors, isExhibitorsPending } =
    useGetExhibitorsList(page, useDebounce(searchText, 300));
  const { AllCategory, isPending } = useGetCategoryAll();
  const dispatch = useDispatch<AppDispatch>();
  const { DeleteExibitor, isPending: isDeletingPending } = useDeleteExibitor();

  const NewValueList = useMemo(() => {
    if (!Exhibitors) return [];

    const lastPage = Exhibitors.response.data;

    return lastPage ?? [];
  }, [Exhibitors]);

  useEffect(() => {
    if (NewValueList.length === 0) return;
    dispatch(setExhibitors(NewValueList));
  }, [NewValueList]);

  if (isPending || isExhibitorsPending) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (errorInError) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay
          title="Table Error"
          message={errorInError?.message as string}
        />
      </div>
    );
  }

  if (!Exhibitors || NewValueList.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div>
        <div className="overflow-x-auto h-[72.5vh] relative custom-scrollbar mb-4">
          <table
            className="min-w-full border-separate"
            style={{ borderSpacing: "0 8px" }}
          >
            <thead className="sticky top-0 z-10 bg-white h-10 shadow border border-gray-200">
              <tr className="">
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
              {/* {!Exhibitors.length && <td className="text-center">No date</td>} */}
              {NewValueList.length > 0 &&
                NewValueList.map((item, index) => (
                  <tr key={index} className="bg-white border w-fit">
                    <td className="pl-3 py-2">{index + 1}</td>
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
                          "w-[100px] h-5 rounded-[7px] flex items-center justify-center mr-2",
                        )}
                      >
                        {AllCategory?.response.find(
                          (pre) => pre.id === item.categoryId,
                        )?.name ?? ""}
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
                    <td className="px-6 py-2 pt-3 flex gap-2 items-center rounded-lg">
                      <Pencil
                        color="#425EBC"
                        onClick={() => dispatch(setSelected(item.id))}
                        size={20}
                        className="cursor-pointer"
                      />
                      <Trash2
                        color="#B85555"
                        onClick={() => dispatch(setIsDeleting(item.id))}
                        size={20}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center bg-white rounded-md border border-gray-400">
            <Button
              size={"sm"}
              className="hover:bg-primary hover:text-white bg-white text-black border-r rounded-r-none"
              disabled={page === 1}
              onClick={() => setPage((pre) => pre - 1)}
              // className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Previous
            </Button>
            {Array.from(
              { length: Exhibitors?.response.max_page },
              (_, i) => i + 1,
            ).map((num) => {
              return (
                <Button
                  key={num}
                  size={"sm"}
                  className={cn(
                    "hover:bg-primary rounded-none hover:text-white bg-white text-black border-r",
                    page === num && "bg-primary text-white",
                  )}
                  onClick={() => setPage(num)}
                >
                  {num}
                </Button>
              );
            })}
            <Button
              size={"sm"}
              className="hover:bg-primary hover:text-white bg-white text-black rounded-l-none"
              disabled={page === Exhibitors?.response.max_page}
              onClick={() => setPage((pre) => pre + 1)}
              // className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Next
            </Button>
          </div>
        </div>
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
