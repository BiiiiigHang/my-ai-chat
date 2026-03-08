import { ChatInterface } from "@/components/chat-interface";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chat Assistant | Supabase + Vercel",
  description: "An AI chat assistant powered by Supabase and Vercel AI SDK",
};

export default function ChatPage() {
  return <ChatInterface />;
}
