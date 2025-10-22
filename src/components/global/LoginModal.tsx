import React from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import User from "@/data/User";
import { useNavigate } from "react-router";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = User.find(p=>p.email === username);

    if(!user){
        console.log("user not found");
        return;
    }

    const token = btoa(username + password)

    localStorage.setItem("token",token)

    navigate('/global-design')
    console.log("Login submitted:", { username, password });
  };

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose()}
      size="sm"
      showCloseButton={false}
    >
      <div className="w-full max-w-md p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg">
          <h1 className="text-[16px] font-[700] text-black mb-8">
            Log in to your account
          </h1>

          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-[12px] text-primary mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john.doe@example.com"
              className="w-full px-4 py-2 bg-bgCard border border-gray-300 rounded-md focus:outline-none focus:border text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-[12px] text-primary mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full px-4 py-2 bg-bgCard border border-gray-300 rounded-md focus:outline-none focus:border text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
