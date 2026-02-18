import NoData from "@/components/global/NoData";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

const NewsDetail = () => {
  const { id } = useParams();
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
    <div className="px-4 pb-4 mx-auto">
      <article className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative h-96 sm:h-[28rem] overflow-hidden group">
            <img
              src={NewsData.bg_img as string}
              alt={NewsData.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                {NewsData.title}
              </h1>
            </div>
          </div>

          <div className="px-6 sm:px-12 py-8 sm:py-12">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6 text-slate-700 leading-relaxed">
                {NewsData.description
                  .split("\n")
                  .filter((para) => para.trim())
                  .map((paragraph, index) => (
                    <p key={index} className="text-lg">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
