"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { categoryQuestions } from "@/lib/categoryQuestions";

interface UserProfile {
  [key: string]: any;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
  userProfile: UserProfile;
}

export default function ChatWindow({ onClose, userProfile }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // 🔹 Load initial questions for selected categories
  useEffect(() => {
    if (userProfile?.interests?.length) {
      const allInitialQuestions = userProfile.interests.flatMap((interest: string) =>
        categoryQuestions[interest]?.initial || []
      );
      setRecommendedQuestions(allInitialQuestions.slice(0, 5));
    }
  }, [userProfile]);

  // 🔹 Send a message (either typed or from a suggestion)
  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend) return;

    const userMsg: Message = { role: "user", content: messageToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend, userProfile }),
      });
      const data = await res.json();
      const botMsg: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);

      // 🔹 Determine follow-up questions
      let foundFollowUps: string[] = [];
      for (const category in categoryQuestions) {
        const followUps = categoryQuestions[category]?.followUps?.[messageToSend];
        if (followUps) {
          foundFollowUps = followUps;
          setActiveCategory(category);
          break;
        }
      }

      // 🔹 Update recommended questions
      if (foundFollowUps.length) {
        setRecommendedQuestions(foundFollowUps);
      } else {
        // If no follow-ups, clear or reset to initial category questions
        const resetQuestions =
          activeCategory && categoryQuestions[activeCategory]?.initial
            ? categoryQuestions[activeCategory].initial
            : [];
        setRecommendedQuestions(resetQuestions);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Oops! Aqua couldn’t connect." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-5 bg-white shadow-2xl rounded-2xl w-80 max-h-[80vh] flex flex-col border border-gray-200 z-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-500 text-white px-4 py-2 rounded-t-2xl">
        <span>💬 Aqua Mentor</span>
        <button
          type="button"
          onClick={() => { console.log("Closing chat"); onClose(); }}
          className="hover:bg-blue-600 p-1 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* 🔹 Recommended Questions */}
      {recommendedQuestions.length > 0 && (
        <div className="p-3 border-b bg-blue-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            💡 Tap a question:
          </h4>
          <div className="flex flex-wrap gap-2">
  {recommendedQuestions.map((q, i) => (
    <button
      key={i}
      onClick={() => sendMessage(q)}
      className="text-xs px-3 py-1.5 rounded-2xl 
                 bg-gradient-to-r from-blue-500 to-indigo-500 
                 text-white font-medium shadow-md 
                 hover:scale-105 hover:shadow-lg 
                 active:scale-95 transition-all duration-200"
    >
      {q}
    </button>
  ))}

          </div>
        </div>
      )}

      {/* Messages */}
<div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm bg-gradient-to-b from-white to-blue-50">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm transition-all duration-300
          ${
            msg.role === "user"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
          }`}
      >
        {msg.content}
      </div>
    </div>
  ))}

  {loading && (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 text-gray-400 rounded-2xl rounded-bl-none px-3 py-2 shadow-sm">
        Aqua is typing<span className="animate-pulse">...</span>
      </div>
    </div>
  )}
</div>


      {/* Input */}
      <div className="flex border-t p-2 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask Aqua something..."
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={() => sendMessage()}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
