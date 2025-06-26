import type { PropsWithChildren } from "react";

import { GuestBanner } from "@/components/guest-banner";
import { GuestUserHandler } from "@/components/guest-user-handler";
import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <GuestUserHandler>
      <GuestBanner />
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="h-full pt-[50px] lg:pl-[256px] lg:pt-0">
        <div className="mx-auto h-full max-w-[1056px] pt-6">{children}</div>
      </main>
    </GuestUserHandler>
  );
};

export default MainLayout;
