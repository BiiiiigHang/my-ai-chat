import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { MessageSquare, ArrowRight, Bot, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 w-full flex flex-col gap-12 items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="flex items-center gap-2 text-lg font-bold">
                <Bot className="w-5 h-5" />
                AI Chat Assistant
              </Link>
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-6">
              <Bot className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-6xl !leading-tight font-bold mb-6">
              Intelligent AI Chat{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Assistant
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Experience intelligent conversations with our AI assistant. 
              Sign up to start chatting, save your conversation history, and enjoy personalized interactions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="w-5 h-5" />
                Start Chatting
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="flex gap-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border font-semibold hover:bg-muted transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
            <div className="border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg bg-card">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Smart Conversations</h3>
              <p className="text-muted-foreground text-center">
                Engage in natural, intelligent conversations with our advanced AI assistant.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg bg-card">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 mx-auto">
                <div className="text-green-600 dark:text-green-400 font-bold">AI</div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Chat History</h3>
              <p className="text-muted-foreground text-center">
                Your conversations are saved securely. Pick up right where you left off.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg bg-card">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
                <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Secure & Private</h3>
              <p className="text-muted-foreground text-center">
                Your data is protected with secure authentication and privacy controls.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border w-full">
            <h2 className="font-bold text-2xl mb-4 text-center">Ready to Experience AI Chat?</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              Join thousands of users who are already having meaningful conversations with our AI assistant.
              No credit card required to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                Create Free Account
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border font-semibold hover:bg-muted transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Try Demo Chat
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full flex flex-col items-center justify-center border-t py-12 mt-16">
          <div className="max-w-5xl w-full px-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">AI Chat Assistant</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                An intelligent chat interface powered by modern AI technology
              </p>
              <div className="text-sm text-muted-foreground">
                © 2026 All rights reserved
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
