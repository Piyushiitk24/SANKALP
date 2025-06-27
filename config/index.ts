import type { Metadata } from "next";

export const siteConfig: Metadata = {
  metadataBase: new URL("https://sankalp-flax.vercel.app"),
  title: "SANKALP® - Study of Advanced Novel Knowledge And Learning Practices",
  description:
    "Interactive gamified learning platform with engaging lessons, quizzes, and progress tracking across multiple subjects.",
  keywords: [
    "reactjs",
    "nextjs",
    "vercel",
    "react",
    "SANKALP",
    "gamified-learning",
    "interactive-education",
    "quiz-platform",
    "learning-management",
    "educational-technology",
    "progress-tracking",
    "shadcn",
    "shadcn-ui",
    "radix-ui",
    "cn",
    "clsx",
    "postgresql",
    "sonner",
    "drizzle",
    "zustand",
    "mysql",
    "lucide-react",
    "next-themes",
    "clerk-themes",
    "clerk",
    "postcss",
    "prettier",
    "react-dom",
    "tailwindcss",
    "tailwindcss-animate",
    "ui/ux",
    "js",
    "javascript",
    "typescript",
    "eslint",
    "html",
    "css",
  ] as Array<string>,
  authors: {
    name: "Piyush Tiwari",
    url: "https://github.com/piyushiitk24",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "SANKALP® - Study of Advanced Novel Knowledge And Learning Practices",
    description: "Interactive gamified learning platform with engaging lessons, quizzes, and progress tracking across multiple subjects.",
    url: "https://sankalp-flax.vercel.app",
    siteName: "SANKALP®",
    images: [
      {
        url: "/heronew.png",
        width: 1200,
        height: 630,
        alt: "SANKALP® - Interactive Gamified Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANKALP® - Study of Advanced Novel Knowledge And Learning Practices",
    description: "Interactive gamified learning platform with engaging lessons, quizzes, and progress tracking across multiple subjects.",
    creator: "@piyushiitk24",
    images: ["/heronew.png"],
  },
} as const;

export const links = {
  sourceCode: "https://github.com/piyushiitk24/SANKALP",
  email: "piyushiitk24@gmail.com",
}
