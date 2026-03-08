import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date | string;
  avatar?: string;
}

export function ChatMessage({
  message,
  isUser,
  timestamp,
  avatar,
}: ChatMessageProps) {
  // 确保时间戳是Date对象
  const timeDate = timestamp ? new Date(timestamp) : new Date();
  const formattedTime = timeDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted rounded-tl-none"
        )}
      >
        <div className="whitespace-pre-wrap">{message}</div>
        <div
          className={cn(
            "text-xs mt-2",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {formattedTime}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">ME</span>
          </div>
        </div>
      )}
    </div>
  );
}
