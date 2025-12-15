import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  ClassName?: string
}

export default function Section({ title, children, ClassName }: SectionProps) {
  return (
    <section className={cn("mb-4 bg-white p-4 rounded-[20px] shadow w-fit", ClassName)}>
      <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 underline">
        {title}
      </h2>
      {children}
    </section>
  );
}
