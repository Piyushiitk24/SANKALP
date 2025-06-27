import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config";

import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#a259ff",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/mascotnew.svg",
          logoPlacement: "inside",
        },
        variables: {
          colorPrimary: "#a259ff",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#000000",
          colorText: "#000000",
          colorTextSecondary: "#6b7280",
          colorSuccess: "#a259ff",
          colorWarning: "#f59e0b",
          colorDanger: "#ef4444",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: "#a259ff",
            borderColor: "#a259ff",
            "&:hover": {
              backgroundColor: "#9333ea",
            },
            "&:focus": {
              backgroundColor: "#9333ea",
              boxShadow: "0 0 0 2px #a259ff40",
            },
          },
          socialButtonsBlockButton: {
            borderColor: "#e5e7eb",
            "&:hover": {
              backgroundColor: "#f9fafb",
            },
          },
          card: {
            boxShadow: "0 10px 15px -3px rgba(162, 89, 255, 0.1), 0 4px 6px -2px rgba(162, 89, 255, 0.05)",
          },
          headerTitle: {
            color: "#1f2937",
          },
          headerSubtitle: {
            color: "#6b7280",
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors closeButton />
            <ExitModal />
            <HeartsModal />
            <PracticeModal />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
