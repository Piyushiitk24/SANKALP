import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";

export const MobileHeader = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[50px] w-full items-center justify-between border-b bg-[#a259ff] dark:bg-[#a259ff]/90 px-4 lg:hidden">
      <MobileSidebar />
      <div className="flex items-center gap-2">
        <ThemeToggle variant="simple" className="h-8 w-8 text-white hover:bg-white/10" />
      </div>
    </nav>
  );
};
