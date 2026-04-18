import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium tracking-wider uppercase",
        {
          "bg-foreground/10 text-foreground": variant === "default",
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400": variant === "success",
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400": variant === "warning",
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400": variant === "destructive",
          "border border-border text-secondary": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
