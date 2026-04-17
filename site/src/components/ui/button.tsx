import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center tracking-wider uppercase font-medium transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none",
          {
            "bg-foreground text-background hover:opacity-90":
              variant === "default",
            "border border-border hover:bg-foreground hover:text-background":
              variant === "outline",
            "hover:bg-muted": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700":
              variant === "destructive",
          },
          {
            "h-10 px-6 text-sm": size === "default",
            "h-8 px-4 text-xs": size === "sm",
            "h-12 px-8 text-sm": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
