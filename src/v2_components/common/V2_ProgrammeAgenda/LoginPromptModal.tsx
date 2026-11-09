import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router";

/** Shown when a logged-out user opens "My agenda" or taps a heart; both need an account. */
const LoginPromptModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();

  return (
    <Modal isOpen={open} onClose={onClose} title="Login required" size="sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="size-12 rounded-full bg-rose-50 text-rose-500 grid place-items-center">
          <Heart className="size-6 fill-current" />
        </span>
        <p className="text-sm text-gray-600">
          Log in to save sessions to your agenda and keep the ones you plan to attend in one place.
        </p>
        <div className="flex w-full gap-2 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-black hover:bg-gray-200"
          >
            Not now
          </Button>
          <Button type="button" onClick={() => navigate("/auth")} className="flex-1 bg-primary">
            Login
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginPromptModal;
