"use client";

import { cn } from "@/lib/utils";
import { Send, Mic, Image, Paperclip } from "lucide-react";
import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message here...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <div className="flex gap-2 mb-2">
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Attach file"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Add image"
                disabled={disabled}
              >
                <Image className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Voice input"
                disabled={disabled}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full min-h-[60px] max-h-[120px] p-3 pr-12 rounded-xl border",
                "bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              rows={2}
            />

            <button
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              className={cn(
                "absolute right-3 bottom-3 p-2 rounded-full",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
