import type { PropsWithChildren } from "react";

import { Footer } from "./footer";
import { Header } from "./header";

const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-2 sm:px-4 lg:px-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MarketingLayout;
