import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Globe, Mail } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExPlaceholderImg from "@/assets/Images/EXPlaceholder.jpg";

interface ExhibitorProps {
  id: string
  close: () => void
}

const ExhibitorsDetails = ({ id, close }: ExhibitorProps) => {
  const { Exhibitors } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );
  const dispatch = useDispatch<AppDispatch>();

  const exhibitorData = useMemo(
    () => Exhibitors.find((p) => p.id === id),
    [id, Exhibitors],
  );

  const { data: ExhibitorFromAPI, isLoading } = useQuery<
    FindExhibitorById,
    AxiosError
  >({
    queryKey: ["exhibitor", id],
    queryFn: async () => {
      const res = await apiRequest("get", `/exhibitor/${id}`);
      return res.response;
    },
    enabled: !exhibitorData && !!id, // only call API if not in redux
    retry: 1,
  });

  const ExhibitorDetails = exhibitorData || ExhibitorFromAPI?.response;

  useEffect(() => {
    if (ExhibitorDetails) {
      dispatch(setTitle(ExhibitorDetails.full_name));
    }
  }, [ExhibitorDetails]);

  if (isLoading) {
    return (
      <div className="py-6 px-5 mx-auto flex flex-col sm:flex-col gap-5">
        <Skeleton className="max-w-5xl mx-auto h-50 w-full sm:w-100" />
        <div className="flex flex-col gap-3 items-start justify-start w-full">
          <Skeleton className="max-w-5xl h-7 w-50 sm:w-100" />
          <Skeleton className="max-w-5xl h-7 w-30" />
          <Skeleton className="max-w-5xl h-7 w-40" />
        </div>
      </div>
    );
  }

  if (!ExhibitorDetails) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex w-fit">
      <div className="relative flex w-fit">
        <div
          onClick={() => close()}
          className="absolute top-0 right-1 cursor-pointer border border-gray-400 bg-white text-gray-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Close
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-8 items-start">
          <div className="shrink-0 sm:w-1/3">
            <div className="h-40 sm:h-48 rounded-2xl overflow-hidden">
              <img
                src={ExhibitorDetails.logo ?? ExPlaceholderImg}
                alt={ExhibitorDetails.full_name}
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>

          <div className="pt-2 sm:pt-4 sm:w-2/3">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 leading-tight">
                  {ExhibitorDetails.full_name}
                </h1>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className="font-semibold rounded-full text-primary"
                    // style={{
                    //   color: ExhibitorDetails.color,
                    //   backgroundColor: ExhibitorDetails.color ? `${ExhibitorDetails.color}20` : '#fef3c7',
                    // }}
                    >
                    {ExhibitorDetails &&
                      ("SponsorType" in ExhibitorDetails
                        ? ExhibitorDetails.SponsorType
                        : "category" in ExhibitorDetails &&
                        ExhibitorDetails.category)}{" "}
                  </span>
                </div>
                {ExhibitorDetails.booth_no &&
                  ExhibitorDetails.booth_no.trim() && (
                    <div className="text-gray-700 mt-3">
                      <p className="font-bold">
                        Booth #{ExhibitorDetails.booth_no}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-wrap">
              {ExhibitorDetails.email && ExhibitorDetails.email.trim() && (
                <a
                  href={`mailto:${ExhibitorDetails.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors duration-200 text-sm break-all max-w-full"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  {ExhibitorDetails.email}
                </a>
              )}
              {ExhibitorDetails.url && ExhibitorDetails.url.trim() && (
                <a
                  href={/^https?:\/\//i.test(ExhibitorDetails.url) ? ExhibitorDetails.url : `https://${ExhibitorDetails.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors duration-200 text-sm break-all max-w-full"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  {ExhibitorDetails.url}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ExhibitorsDetails;
