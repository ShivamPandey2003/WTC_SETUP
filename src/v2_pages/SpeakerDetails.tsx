import NoData from "@/components/global/NoData";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Briefcase,
  Building2,
  ExternalLink,
  MessageCircle,
  Linkedin,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

const SpeakerDetails = () => {
  const { speakers } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const speakerDetails = useMemo(
    () => speakers.find((speaker) => speaker.speaker_id === id),
    [id, speakers],
  );

  useEffect(() => {
    if (speakerDetails) {
      dispatch(
        setTitle(
          `${speakerDetails.prefix} ${speakerDetails.firstname} ${speakerDetails.lastname}`,
        ),
      );
    }
  }, [speakerDetails]);

  if (!speakerDetails) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 mx-auto">
      <article className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative px-6 sm:px-12 pb-12">
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="relative p-4">
                  <img
                    src={speakerDetails.profile_image}
                    alt={`${speakerDetails.firstname} ${speakerDetails.lastname}`}
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-2xl"
                  />
                  {speakerDetails.keyNote && (
                    <div className="absolute top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Keynote
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 pt-0 sm:pt-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 leading-tight">
                      {speakerDetails.prefix} {speakerDetails.firstname}{" "}
                      {speakerDetails.lastname}
                    </h1>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">
                          {speakerDetails.designation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">
                          {speakerDetails.company}
                        </span>
                      </div>
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
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                {speakerDetails.bio}
              </p>
            </div>

            {speakerDetails.attachments &&
              speakerDetails.attachments.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Attachments
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {speakerDetails.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                      >
                        <img
                          src={attachment.base64}
                          alt={attachment.filename}
                          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white text-sm font-medium truncate">
                            {attachment.filename}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {speakerDetails.coming_sessions &&
              speakerDetails.coming_sessions.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Coming Sessions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {speakerDetails.coming_sessions.map((session, index) => (
                      <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                      >
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {session.title}
                        </h3>
                        <p className="text-slate-600 text-sm">
                          {session.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Added on{" "}
                {new Date(speakerDetails.created_on).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SpeakerDetails;
