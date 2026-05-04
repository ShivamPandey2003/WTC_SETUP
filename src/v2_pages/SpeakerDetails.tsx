import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import PlaceholderImage from "@/assets/Images/placeholder.webp";
import {
  Briefcase,
  Building2,
  ExternalLink,
  MessageCircle,
  Linkedin,
  Lectern,
  MapPin,
  CalendarDays,
  Clock,
  Mail,
  File,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

interface SpeakerProps {
  id: string
  close?: (() => void) | null
}

const SpeakerDetails = ({ id, close }: SpeakerProps) => {
  const { speakers } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const speakerFromRedux = useMemo(
    () => speakers.find((speaker) => speaker.speaker_id === id),
    [id, speakers],
  );

  const { data: speakerFromAPI, isLoading } = useQuery<
    FindSpeakerById,
    AxiosError
  >({
    queryKey: ["speaker", id],
    queryFn: async () => {
      const res = await apiRequest("get", `/speaker/${id}`);
      return res.response;
    },
    enabled: !speakerFromRedux && !!id, // only call API if not in redux
    retry: 1,
  });

  const speakerDetails = speakerFromRedux || speakerFromAPI?.response;

  useEffect(() => {
    if (speakerDetails) {
      dispatch(
        setTitle(
          `${speakerDetails.prefix} ${speakerDetails.firstname} ${speakerDetails.lastname}`,
        ),
      );
    }
  }, [speakerDetails]);

  if (isLoading) {
    return (
      <div className="rounded-2xl overflow-hidden">
        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Profile Image Skeleton */}
            <div className="flex-shrink-0">
              <div className="relative p-4">
                <Skeleton className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 pt-0 sm:pt-8">
              {/* Name Skeleton */}
              <div className="mb-4">
                <Skeleton className="h-12 w-3/4 mb-4 rounded-lg" />
                {/* Designation & Company Skeleton */}
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-1/2 rounded" />
                  <Skeleton className="h-5 w-1/3 rounded" />
                </div>
              </div>

              {/* Social Buttons Skeleton */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Bio Section Skeleton */}
          <div className="mt-4 pt-8 border-t border-slate-200">
            <Skeleton className="h-8 w-24 mb-4 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!speakerDetails) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className=" rounded-2xl overflow-hidden">
      <div className="relative">
        {close && (
          <div
            onClick={() => close()}
            className="absolute top-2 right-0 cursor-pointer border border-gray-400 text-gray-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Close
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="flex-shrink-0">
            <div className="relative p-2 sm:p-4">
              <img
                src={speakerDetails.profile_image ?? PlaceholderImage}
                alt={`${speakerDetails.firstname} ${speakerDetails.lastname}`}
                className="w-32 h-32 sm:w-56 sm:h-56 rounded-2xl object-cover object-top"
              />
              {speakerDetails.keyNote && (
                <div className="absolute top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Keynote
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 pt-1 sm:pt-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-5xl font-bold text-slate-900 mb-2 leading-tight">
                  {speakerDetails.prefix} {speakerDetails.firstname}{" "}
                  {speakerDetails.lastname}
                </h1>
                <div className="flex flex-wrap gap-4 mt-4">
                  {speakerDetails.designation &&
                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">
                        {speakerDetails.designation}
                      </span>
                    </div>
                  }
                  {speakerDetails.company &&
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">
                        {speakerDetails.company}
                      </span>
                    </div>
                  }
                  {speakerDetails.total_sessions > 0 && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Lectern className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">
                        {speakerDetails.total_sessions}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {speakerDetails.linkedin_url && (
                <a
                  href={speakerDetails.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <Linkedin size={18} className="w-5 h-5 text-white" />
                  LinkedIn
                </a>
              )}
              {speakerDetails.whatsapp_url && (
                <a
                  href={speakerDetails.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              )}
              {speakerDetails.external_link && (
                <a
                  href={speakerDetails.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  Website
                </a>
              )}
              {speakerDetails.email?.trim() && (
                <a
                  href={`mailto:${speakerDetails.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </a>
              )}
            </div>
          </div>
        </div>

        {speakerDetails.bio &&
          <div className="mt-4 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
            <p className="text-md text-slate-700 leading-relaxed">
              {speakerDetails.bio}
            </p>
          </div>
        }

        {speakerDetails.attachments &&
          speakerDetails.attachments.length > 0 && (
            <div className="mt-4 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Attachments
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {speakerDetails.attachments.map((attachment, index) => {
                  return (
                    <div
                      onClick={() =>
                        navigate(
                          `/attachment/${speakerDetails.speaker_id}`,
                          {
                            state: { Title: attachment.filename, type: 1 },
                          },
                        )
                      }
                      key={index}
                      className="group cursor-pointer relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="flex items-end p-4 gap-2">
                        <File size={20} />
                        <span className="text-black text-sm font-medium truncate max-w-[220px]">
                          {attachment.filename}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {speakerDetails.coming_sessions &&
          speakerDetails.coming_sessions.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Upcoming Sessions
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {speakerDetails.coming_sessions.map((session, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
                  >
                    <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">
                      {session.title}
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-1 mb-3">
                      {session.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <p className="text-slate-700 text-xs truncate">
                          {session.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <p className="text-slate-700 text-xs">
                          {session.start_date} → {session.end_date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <p className="text-slate-700 text-xs">
                          {session.start_time} - {session.end_time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SpeakerDetails;
