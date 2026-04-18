"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster position="top-right" duration={3000} richColors closeButton />
      </MotionConfig>
    </ThemeProvider>
  );
}
