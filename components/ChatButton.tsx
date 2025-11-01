"use client";
import ChatWindow from "./ChatWindow";
import { MessageCircle } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface UserProfile {
  [key: string]: any;
}

interface ChatButtonProps {
  userProfile: UserProfile | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ChatButton({ userProfile, isOpen, setIsOpen }: ChatButtonProps) {
  if (!userProfile) return null;

  return (
    <>
      {isOpen && (
        <ChatWindow 
          userProfile={userProfile} 
          onClose={() => setIsOpen(false)} 
        />
      )}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </>
  );
}
