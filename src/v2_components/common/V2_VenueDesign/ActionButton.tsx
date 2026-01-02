import type { IconType } from "react-icons/lib";

type ActionButtonProps = {
  Icon: IconType;
  action: string;
  setAction: () => void;
  ACTION: string;
  size?: string | number;
};

const ActionButton = ({
  Icon,
  action,
  setAction,
  ACTION,
  size = "2rem",
}: ActionButtonProps) => {
  return (
    <button
      className={
        action === ACTION
          ? "bg-violet-300 p-1 rounded"
          : "p-1 hover:bg-violet-100 rounded"
      }
      onClick={() => setAction()}
    >
      <Icon size={size} />
    </button>
  );
};

export default ActionButton;
