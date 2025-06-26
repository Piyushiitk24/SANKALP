import type { Metadata } from "next";

export const siteConfig: Metadata = {
  metadataBase: new URL("https://sankalp-piyushiitk24.vercel.app"),
  title: "SANKALP",
  description:
    "Interactive platform for language learning with lessons, quizzes, and progress tracking.",
  keywords: [
    "reactjs",
    "nextjs",
    "vercel",
    "react",
    "Gamification_Quiz",
    "learn-language",
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
    icon: "/mascotnew.svg",
    shortcut: "/mascotnew.svg",
    apple: "/mascotnew.svg",
  },
  openGraph: {
    title: "SANKALP",
    description: "Interactive platform for language learning with lessons, quizzes, and progress tracking.",
    url: "https://sankalp-piyushiitk24.vercel.app",
    siteName: "SANKALP",
    images: [
      {
        url: "/heronew.png",
        width: 1200,
        height: 630,
        alt: "SANKALP - Interactive Language Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANKALP",
    description: "Interactive platform for language learning with lessons, quizzes, and progress tracking.",
    creator: "@piyushiitk24",
    images: ["/heronew.png"],
  },
} as const;

export const links = {
  sourceCode: "https://github.com/piyushiitk24/SANKALP",
  email: "piyushiitk24@gmail.com",
}
