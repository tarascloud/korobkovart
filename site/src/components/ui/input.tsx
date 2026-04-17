import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "w-full px-4 py-3 bg-transparent border border-border focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/50 outline-none transition-colors text-sm",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
export { Input };
