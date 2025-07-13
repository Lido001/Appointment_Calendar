import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto flex items-start justify-center px-4 py-8">
      <div className="bg-white rounded-2xl w-full max-w-lg relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-600"
          onClick={onClose}
        >
          <IoCloseCircleOutline className="text-3xl" />
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
