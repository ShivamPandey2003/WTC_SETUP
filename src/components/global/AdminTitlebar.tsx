import { Button } from "../ui/Button";

type prop = {
  Title:string,
  onSave:()=>void
  show?:boolean
}

const AdminTitlebar:React.FC<prop> = ({Title, onSave, show=true}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-semibold text-gray-800">{Title}</h1>
      {show && <Button onClick={onSave} className="w-[100px] py-1 h-7">Save</Button>}
    </div>
  );
};

export default AdminTitlebar;
