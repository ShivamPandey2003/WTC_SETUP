import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for AgendaList: time-slot headers with AgendaRow-shaped cards. */
export const AgendaListSkeleton = ({ slots = 3 }: { slots?: number }) => (
  <div className="pb-6" aria-busy="true" aria-label="Loading sessions">
    {Array.from({ length: slots }, (_, slot) => (
      <section key={slot}>
        <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary/10 border-b border-gray-100">
          <Skeleton className="h-4 w-16 bg-primary/15" />
          <Skeleton className="h-3.5 w-36 bg-primary/15" />
        </div>
        <div className="px-1 sm:px-2 py-1.5 flex flex-col gap-0.5">
          {Array.from({ length: slot === 0 ? 3 : 2 }, (_, i) => (
            <div key={i} className="flex gap-3 px-3 sm:px-4 py-3">
              <Skeleton className="w-1 shrink-0 rounded-full" />
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className={i % 2 ? "h-4 w-3/5" : "h-4 w-4/5"} />
                <div className="flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
);

/** Placeholder for the facet sections in AgendaFilterPanel. */
export const AgendaFilterSkeleton = () => (
  <div className="flex flex-col gap-5 px-2" aria-busy="true" aria-label="Loading filters">
    <Skeleton className="h-9 w-full rounded-lg" />
    {[5, 3, 4].map((rows, s) => (
      <div key={s} className="flex flex-col gap-2.5">
        <Skeleton className="h-3.5 w-20" />
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-3.5 flex-1" />
            <Skeleton className="h-3 w-5" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

/** Placeholder for AgendaDetail while a linked session's day is loading. */
export const AgendaDetailSkeleton = () => (
  <div className="p-5 flex flex-col gap-4" aria-busy="true" aria-label="Loading session">
    <Skeleton className="h-5 w-32 rounded-full" />
    <Skeleton className="h-6 w-11/12" />
    <Skeleton className="h-6 w-2/3" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-9 flex-1 rounded-lg" />
      <Skeleton className="h-9 flex-1 rounded-lg" />
    </div>
    <Skeleton className="h-20 w-full rounded-lg" />
    {Array.from({ length: 2 }, (_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
