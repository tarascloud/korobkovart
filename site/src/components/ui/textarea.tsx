import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "w-full px-4 py-3 bg-transparent border border-border focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/50 outline-none transition-colors resize-none text-sm",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
export { Textarea };
