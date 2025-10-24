import React from "react";

interface SectionProp {
  children: React.ReactNode;
  title: string;
}

const ExibitorSection: React.FC<SectionProp> = ({ children, title }) => {
  return (
    <div className="my-12">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-[14px] font-[500]">{title}</h2>
        <div className="flex-1 border-[1px] border-[#4A44591A]" />
      </div>
      {children}
    </div>
  );
};

export default ExibitorSection;
