"use client";

import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Trash2, Clock } from "lucide-react";
import { useState } from "react";

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date | string;
  messageCount: number;
}

interface ChatSidebarProps {
  chats: ChatHistory[];
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onCreateNewChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatTime = (date: Date | string) => {
    // 确保date是Date对象
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // 检查dateObj是否有效
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Just now';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="font-semibold text-lg">Chat History</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <div
                className={cn(
                  "border-t-2 border-r-2 border-foreground w-2 h-2 transform transition-transform",
                  isCollapsed ? "rotate-45" : "-rotate-135"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={onCreateNewChat}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transition-colors font-medium"
          )}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && "New Chat"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No chat history yet</p>
            <p className="text-xs mt-2">Start a new conversation!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group relative p-3 rounded-lg cursor-pointer transition-colors",
                  activeChatId === chat.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <MessageSquare
                      className={cn(
                        "w-4 h-4",
                        activeChatId === chat.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm truncate">
                          {chat.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(chat.timestamp)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {chat.messageCount} messages
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium">AI Assistant</p>
              <p className="text-xs">Powered by Supabase & Vercel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
