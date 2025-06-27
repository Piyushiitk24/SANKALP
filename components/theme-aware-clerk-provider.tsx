"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { type ReactNode } from "react";

interface ThemeAwareClerkProviderProps {
  children: ReactNode;
}

export function ThemeAwareClerkProvider({ children }: ThemeAwareClerkProviderProps) {
  const { theme } = useTheme();

  const appearance = {
    baseTheme: theme === "dark" ? dark : undefined,
    layout: {
      logoImageUrl: "/mascotnew.svg",
      logoPlacement: "inside" as const,
    },
    variables: {
      colorPrimary: "#a259ff",
      borderRadius: "0.75rem",
      fontSize: "14px",
    },
    elements: {
      formButtonPrimary: {
        backgroundColor: "#a259ff",
        borderColor: "#a259ff",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#9333ea",
          borderColor: "#9333ea",
        },
        "&:focus": {
          backgroundColor: "#9333ea",
          boxShadow: "0 0 0 2px rgba(162, 89, 255, 0.4)",
        },
      },
      card: {
        boxShadow: theme === "dark" 
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
          : "0 10px 15px -3px rgba(162, 89, 255, 0.1), 0 4px 6px -2px rgba(162, 89, 255, 0.05)",
      },
      socialButtonsBlockButton: {
        "&:hover": {
          backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
        },
      },
      footerActionLink: {
        color: "#a259ff",
        "&:hover": {
          color: "#9333ea",
        },
      },
    },
  };

  return (
    <ClerkProvider appearance={appearance}>
      {children}
    </ClerkProvider>
  );
}
