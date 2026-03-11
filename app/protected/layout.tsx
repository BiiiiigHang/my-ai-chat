import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Bot } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 w-full flex flex-col gap-12 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Chat Assistant
              </Link>
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-8 max-w-5xl p-5 w-full">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t py-12 mt-8">
          <div className="max-w-5xl w-full px-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">AI Chat Assistant</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Protected area - Your conversations are secure
              </p>
              <ThemeSwitcher />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
