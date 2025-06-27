"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  variant?: "dropdown" | "simple";
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ 
  variant = "dropdown", 
  className,
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)} disabled>
        <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    );
  }

  if (variant === "simple") {
    const isDark = theme === "dark";
    
    return (
      <Button
        variant="ghost"
        size={showLabel ? "sm" : "icon"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "transition-all duration-200 hover:bg-accent/50",
          "focus:ring-2 focus:ring-[#a259ff] focus:ring-offset-2",
          showLabel ? "h-9 px-3" : "h-9 w-9",
          className
        )}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <Sun className={cn(
          "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300",
          "dark:-rotate-90 dark:scale-0"
        )} />
        <Moon className={cn(
          "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300",
          "dark:rotate-0 dark:scale-100"
        )} />
        {showLabel && (
          <span className="ml-2 text-sm">
            {isDark ? "Light" : "Dark"}
          </span>
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative h-9 w-9", className)}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-border">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className="mr-2 h-4 w-4">💻</span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
