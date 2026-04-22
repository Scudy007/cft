import "@radix-ui/themes/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "./ThemeProvider";
import NavBar from "./NavBar";
import AuthProvider from "./auth/Provider";
import QueryClientProvider from "./QueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecAudit | Дашборд",
  description: "Система аудита информационной безопасности",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-200 transition-colors duration-300 relative z-0`}>
        
        <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none hidden dark:block -z-10" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none hidden dark:block -z-10" />

        <QueryClientProvider>
          <AuthProvider>
            <ThemeProvider>
              <Theme accentColor="indigo" radius="large" hasBackground={false}>
                <NavBar />
                <main className="p-5 relative z-10">{children}</main>
              </Theme>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}