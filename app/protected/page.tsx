import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon, MessageSquare, History, Shield } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return JSON.stringify(data.claims, null, 2);
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your Account Details</h2>
        <p className="text-muted-foreground mb-4">
          Your authentication details are shown below. This information is securely stored and only accessible to you.
        </p>
        <pre className="text-xs font-mono p-4 rounded-lg border bg-card max-h-48 overflow-auto w-full">
          <Suspense>
            <UserDetails />
          </Suspense>
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Start Chatting</h3>
          <p className="text-muted-foreground mb-4">
            Begin a conversation with our AI assistant. Your chat history will be saved automatically.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Go to Chat →
          </Link>
        </div>

        <div className="border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <History className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Chat History</h3>
          <p className="text-muted-foreground mb-4">
            View and manage your previous conversations. All your chats are stored securely.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View History →
          </Link>
        </div>

        <div className="border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Account Security</h3>
          <p className="text-muted-foreground mb-4">
            Manage your account settings, update your password, and review security preferences.
          </p>
          <Link
            href="/auth/update-password"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Security Settings →
          </Link>
        </div>
      </div>

      <div className="border rounded-xl p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <h2 className="font-bold text-2xl mb-4">Getting Started</h2>
        <p className="text-muted-foreground mb-6">
          Now that you're authenticated, here's what you can do:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <span>Start a new conversation with the AI assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <span>Access your complete chat history</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <span>Manage your account settings and preferences</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <span>Explore advanced features and customization</span>
          </div>
        </div>
      </div>
    </div>
  );
}
