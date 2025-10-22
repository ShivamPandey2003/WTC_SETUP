import ColorPicker from "@/components/common/Global_Design/ColorPicker";
import LogoUpload from "@/components/common/Global_Design/LogoUpload";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import TextStyleRow from "@/components/global/TextStyleRow";

const GlobalDesign_page = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6">
        <AdminTitlebar Title="Global Design" onSave={()=>{}} />
        <Section title="Color Scheme">
          <ColorPicker
            label="Primary Color"
            color="#318061"
            description="The primary color is used in bold titles, default selection buttons and everywhere where user's attention has to be brought in."
          />
          <ColorPicker
            label="Secondary Color"
            color="#D6E6DF"
            description="The primary color is used in bold titles, default selection buttons and everywhere where user's attention has to be brought in."
          />
        </Section>
        <Section title="Logo">
          <LogoUpload />
        </Section>
        <Section title="Text and styles">
            <TextStyleRow label="Font family" value="Inter Sans" onChange={()=>{}} />
            <TextStyleRow label="Heading 1" value="20 px" onChange={()=>{}} />
            <TextStyleRow label="Heading 2" value="16 px" onChange={()=>{}} />
            <TextStyleRow label="Heading 3" value="14 px" onChange={()=>{}} />
            <TextStyleRow label="All other text" value="14 px" onChange={()=>{}} />
          </Section>
      </div>
    </div>
  );
};

export default GlobalDesign_page;
