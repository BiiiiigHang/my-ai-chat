"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatSidebar } from "./chat-sidebar";
import { Bot, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date | string;
  messageCount: number;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 加载聊天历史
    const loadChats = async () => {
      try {
        const response = await fetch('/api/chats');
        if (response.ok) {
          const data = await response.json();
          setChats(data.chats);
          
          // 如果有聊天记录，加载第一个聊天的消息
          if (data.chats.length > 0) {
            setActiveChatId(data.chats[0].id);
            await loadMessages(data.chats[0].id);
          } else {
            // 如果没有聊天记录，显示欢迎消息
            setMessages([
              {
                id: "1",
                content: "Hello! I'm your AI assistant powered by DeepSeek. How can I help you today?",
                isUser: false,
                timestamp: new Date(),
              },
            ]);
          }
        }
      } catch (error) {
        console.error('Error loading chats:', error);
        // 如果加载失败，显示示例数据
        const now = Date.now();
        setMessages([
          {
            id: "1",
            content: "Hello! I'm your AI assistant powered by DeepSeek. How can I help you today?",
            isUser: false,
            timestamp: new Date(now - 300000),
          },
        ]);
      }
    };

    loadChats();
  }, []);

  // 加载特定聊天的消息
  const loadMessages = async (chatId: string) => {
    try {
      if (!chatId) {
        // 如果没有聊天ID，显示空消息
        setMessages([]);
        return;
      }

      // 调用API获取特定聊天的消息
      const response = await fetch(`/api/chats/${chatId}/messages`);
      
      if (response.status === 401) {
        // 用户未登录，显示空消息
        console.log('User not authenticated, showing empty messages');
        setMessages([]);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // 如果没有消息，显示空消息
          console.log('No messages found for chat:', chatId);
          setMessages([]);
        }
      } else {
        console.error('Failed to load messages:', response.status, response.statusText);
        // 如果API失败，显示空消息
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // 如果出错，显示空消息
      setMessages([]);
    }
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // 创建AI消息的占位符
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content,
          chatId: activeChatId || undefined 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to get AI response' }));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';
      let currentChatId = activeChatId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解码数据并添加到缓冲区
        buffer += decoder.decode(value, { stream: true });
        
        // 按行分割缓冲区
        const lines = buffer.split('\n');
        
        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;
          
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6);
            
            // 跳过空数据
            if (!data) continue;
            
            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'chunk' && parsed.content) {
                // 更新AI消息内容
                fullResponse += parsed.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: fullResponse }
                      : msg
                  )
                );
              } else if (parsed.type === 'complete' && parsed.chatId) {
                // 流完成，更新chatId
                currentChatId = parsed.chatId;
                
                // 如果这是新对话，更新 activeChatId
                if (currentChatId && currentChatId !== activeChatId) {
                  setActiveChatId(currentChatId);
                  
                  // 重新加载聊天列表
                  const chatsResponse = await fetch('/api/chats');
                  if (chatsResponse.ok) {
                    const chatsData = await chatsResponse.json();
                    setChats(chatsData.chats);
                  }
                } else {
                  // 更新现有聊天的最后消息
                  setChats((prev) =>
                    prev.map((chat) =>
                      chat.id === currentChatId
                        ? {
                            ...chat,
                            lastMessage: content.length > 50 ? content.substring(0, 47) + '...' : content,
                            timestamp: new Date(),
                            messageCount: chat.messageCount + 2,
                          }
                        : chat
                    )
                  );
                }
                // 流完成，退出循环
                return;
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error || 'Stream processing error');
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError, data);
            }
          }
        }
      }
      
      // 如果循环结束但没有收到完成信号，手动触发完成
      if (fullResponse) {
        // 保存响应到数据库（通过API的完成信号已经处理）
        console.log('Stream completed without explicit complete signal');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // 更新错误消息
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { 
                ...msg, 
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key configuration and try again.`
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `New Chat ${chats.length + 1}`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newChat = data.chat;
        
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setMessages([]);
      } else {
        console.error('Failed to create new chat');
        // 如果 API 失败，使用本地状态
        const newChatId = `chat-${Date.now()}`;
        const newChat: ChatHistory = {
          id: newChatId,
          title: `New Chat ${chats.length + 1}`,
          lastMessage: "Start a conversation...",
          timestamp: new Date(),
          messageCount: 0,
        };

        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(newChatId);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      // 如果 API 失败，使用本地状态
      const newChatId = `chat-${Date.now()}`;
      const newChat: ChatHistory = {
        id: newChatId,
        title: `New Chat ${chats.length + 1}`,
        lastMessage: "Start a conversation...",
        timestamp: new Date(),
        messageCount: 0,
      };

      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChatId);
      setMessages([]);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setActiveChatId(chatId);
    // 加载选中聊天的消息
    await loadMessages(chatId);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats?id=${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 从本地状态中移除
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        
        if (activeChatId === chatId) {
          if (chats.length > 1) {
            const remainingChats = chats.filter((chat) => chat.id !== chatId);
            setActiveChatId(remainingChats[0].id);
            await loadMessages(remainingChats[0].id);
          } else {
            // 如果没有其他聊天，创建一个新的
            await handleCreateNewChat();
          }
        }
      } else {
        console.error('Failed to delete chat');
        // 如果 API 失败，只更新本地状态
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (activeChatId === chatId && chats.length > 1) {
          const remainingChats = chats.filter((chat) => chat.id !== chatId);
          setActiveChatId(remainingChats[0].id);
          await handleSelectChat(remainingChats[0].id);
        } else if (chats.length === 1) {
          await handleCreateNewChat();
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      // 如果 API 失败，只更新本地状态
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (activeChatId === chatId && chats.length > 1) {
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        setActiveChatId(remainingChats[0].id);
        await handleSelectChat(remainingChats[0].id);
      } else if (chats.length === 1) {
        await handleCreateNewChat();
      }
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onCreateNewChat={handleCreateNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col">
        <header className="border-b p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">AI Chat Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  Powered by Supabase & Vercel AI SDK
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                <Bot className="w-4 h-4" />
                <span>Online</span>
              </div>
              <button 
                onClick={() => {
                  if (messages.length > 0 && window.confirm('确定要清空当前聊天吗？')) {
                    setMessages([]);
                  }
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-8">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3">
                  Start a conversation with AI
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Ask me anything about programming, project ideas, or get help
                  with your Supabase and Next.js projects.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    "How do I set up authentication with Supabase?",
                    "What are best practices for Next.js 15?",
                    "Can you help me debug this React component?",
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                    >
                      <p className="text-sm">{suggestion}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                ))}
                {isLoading && (
                  <div className="flex gap-3 p-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </main>

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="Ask me anything about programming, AI, or your project..."
        />
      </div>
    </div>
  );
}
