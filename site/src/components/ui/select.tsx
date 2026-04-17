import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    className={cn(
      "w-full px-4 py-3 bg-transparent border border-border focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/50 outline-none transition-colors text-sm",
      className
    )}
    ref={ref}
    {...props}
  />
));
Select.displayName = "Select";
export { Select };
