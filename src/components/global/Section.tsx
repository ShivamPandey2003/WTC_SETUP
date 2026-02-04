import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  ClassName?: string;
  onSave?:()=>void
  show?:boolean
  loading?:boolean
}

export default function Section({ title, children, ClassName, onSave, show, loading }: SectionProps) {
  return (
    <section
      className={cn("mb-4 bg-white p-4 rounded-[20px] shadow w-fit", ClassName)}
    >
      <div className="w-full flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 underline">
          {title}
        </h2>
        {show && <Button onClick={onSave} className="w-[100px] py-1 h-7" disabled={loading}>{loading?"Saving...":"Save"}</Button>}
      </div>
      {children}
    </section>
  );
}
