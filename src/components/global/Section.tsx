interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 underline">
        {title}
      </h2>
      {children}
    </section>
  );
}
