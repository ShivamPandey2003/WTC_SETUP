import NoData from "@/components/global/NoData";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExPlaceholderImg from "@/assets/Images/EXPlaceholder.jpg";

interface NewsDetailProps {
  id: string;
  close: () => void;
}

const NewsDetail = ({ id, close }: NewsDetailProps) => {
  const { News } = useSelector((state: RootState) => state.ExtraSlice);
  const dispatch = useDispatch<AppDispatch>();

  const NewsData = useMemo(() => News.find((p) => p.id === id), [id, News]);

  useEffect(() => {
    if (NewsData) {
      dispatch(setTitle(NewsData.title));
    }
  }, [NewsData]);

  if (!NewsData) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl">
      <div
        onClick={close}
        className="absolute top-2 right-2 cursor-pointer border border-gray-400 text-gray-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 bg-white"
      >
        Close
      </div>
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="relative h-72 sm:h-96 overflow-hidden group">
          <img
            src={NewsData.bg_img ? NewsData.bg_img : ExPlaceholderImg}
            alt={NewsData.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
              {NewsData.title}
            </h1>
          </div>
        </div>

        <div className="px-6 sm:px-10 py-6 sm:py-8">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {NewsData.description
                .split("\n")
                .filter((para) => para.trim())
                .map((paragraph, index) => (
                  <p key={index} className="text-base">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
