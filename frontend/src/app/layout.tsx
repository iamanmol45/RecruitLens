import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { NotificationsDropdown } from "@/components/dashboard/notifications";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const manrope = Manrope({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "RecruitLens",
  description: "See Beyond the Resume",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>

      <head>
        <script dangerouslySetInnerHTML={{__html: `
          try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
              document.documentElement.classList.remove('dark');
              document.documentElement.classList.add('light');
            } else {
              document.documentElement.classList.add('dark');
              document.documentElement.classList.remove('light');
            }
          } catch (_) {}
        `}} />
      </head>
      <body className={`${manrope.className} antialiased`}> 

        <Sidebar />
        {/* main pushed right of the fixed sidebar */}
        <main className="h-screen overflow-y-auto relative" style={{ marginLeft: "220px" }}>
          {/* Global Header Actions */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-2.5">
            <NotificationsDropdown />
            <ThemeToggle />
          </div>
          <div className="p-4 flex flex-col min-h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
