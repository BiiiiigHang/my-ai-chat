import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { MessageSquare, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>AI Chat with Supabase</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="flex flex-col gap-16 items-center">
            <div className="flex gap-8 justify-center items-center">
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SB</span>
                </div>
              </a>
              <span className="border-l rotate-45 h-6" />
              <a href="https://vercel.com/" target="_blank" rel="noreferrer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VC</span>
                </div>
              </a>
              <span className="border-l rotate-45 h-6" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl !leading-tight mx-auto max-w-2xl text-center font-bold">
              Build AI Chat Apps with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Supabase & Vercel
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl text-center">
              A fully-featured AI chat interface with user authentication, real-time
              messaging, and chat history—powered by Next.js 15.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Launch AI Chat
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://github.com/vercel/next.js/tree/canary/examples/with-supabase"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border font-semibold hover:bg-muted transition-colors"
              >
                View Source Code
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-2xl p-6 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Real-time AI Chat</h3>
              <p className="text-muted-foreground">
                Interactive chat interface with simulated AI responses, message history, and typing indicators.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <div className="text-green-600 dark:text-green-400 font-bold">SB</div>
              </div>
              <h3 className="font-bold text-lg mb-2">Supabase Integration</h3>
              <p className="text-muted-foreground">
                Ready for Supabase authentication and database integration for storing chat history and user data.
              </p>
            </div>

            <div className="border rounded-2xl p-6 hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Modern UI Components</h3>
              <p className="text-muted-foreground">
                Built with Tailwind CSS, shadcn/ui components, and responsive design for all devices.
              </p>
            </div>
          </div>

          <div className="border rounded-2xl p-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <h2 className="font-bold text-2xl mb-4">Ready to Build Your AI Chat?</h2>
            <p className="text-muted-foreground mb-6">
              This starter template includes everything you need to build a production-ready AI chat application:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span>User authentication with Supabase</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span>Real-time chat interface</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span>Chat history and sidebar</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span>Responsive mobile design</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span>Dark/light mode support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span>Easy Vercel deployment</span>
              </div>
            </div>
          </div>

          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">Getting Started</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Built with{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>{" "}
            and{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Next.js
            </a>{" "}
            for AI chat applications
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
