// components/ChatIcon.tsx
import { useState } from "react";
import ChatWindow from '@/pages/messages';

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChatWindow}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg focus:outline-none"
        >
          💬
        </button>
      </div>
      {isOpen && <ChatWindow onClose={toggleChatWindow} />}
    </>
  );
}
