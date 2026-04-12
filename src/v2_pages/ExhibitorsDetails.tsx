import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Copy, ExternalLink, Globe, Mail } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "sonner";
import ExPlaceholderImg from "@/assets/Images/EXPlaceholder.jpg";

const ExhibitorsDetails = () => {
  const { id } = useParams();
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

  const handleCopyEmail = (str: string) => {
    navigator.clipboard.writeText(str);
    toast.success("Email Copied Successfully");
  };

  useEffect(() => {
    if (ExhibitorDetails) {
      dispatch(setTitle(ExhibitorDetails.full_name));
    }
  }, [ExhibitorDetails]);

  if (isLoading) {
    return (
      <div className="px-4 pb-4 mx-auto">
        <Skeleton className="max-w-5xl mx-auto h-[85vh]" />
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
    <div className="px-4 pb-4 mx-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative px-6 py-6">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="shrink-0 w-1/3">
                <div className="h-40 sm:h-48 rounded-2xl overflow-hidden">
                  <img
                    src={ExhibitorDetails.logo ?? ExPlaceholderImg}
                    alt={ExhibitorDetails.full_name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>

              <div className="flex-1 pt-2 sm:pt-4">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 leading-tight">
                      {ExhibitorDetails.full_name}
                    </h1>
                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className="text-sm font-semibold px-3 py-1 rounded-full"
                        style={{
                          color: ExhibitorDetails.color,
                          backgroundColor: ExhibitorDetails.color ? `${ExhibitorDetails.color}20` : '#fef3c7',
                        }}>
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

                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                  {ExhibitorDetails.email && ExhibitorDetails.email.trim() && (
                    <a
                      href={`mailto:${ExhibitorDetails.email}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Mail className="w-5 h-5" />
                      Email
                    </a>
                  )}
                  {ExhibitorDetails.url && ExhibitorDetails.url.trim() && (
                    <a
                      href={ExhibitorDetails.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <Globe className="w-5 h-5" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ExhibitorDetails.email && ExhibitorDetails.email.trim() && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        Email Address
                      </h3>
                      <Copy
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleCopyEmail(ExhibitorDetails.email)}
                      />
                    </div>
                    <p className="text-slate-700 text-lg font-medium">
                      {ExhibitorDetails.email}
                    </p>
                  </div>
                )}
                {ExhibitorDetails.url && ExhibitorDetails.url.trim() && (
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-6 h-6 text-cyan-600" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        Website
                      </h3>
                    </div>
                    <a
                      href={ExhibitorDetails.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-2 group"
                    >
                      {ExhibitorDetails.url}
                      <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorsDetails;
