"use client";

import { isValidElement, type ReactNode, type ElementType } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * EmptyState — canonical shared component (UX-05-20260425).
 *
 * Source of truth: this file. Mirrored verbatim in:
 *   - jf-private/src/components/EmptyState.tsx
 *   - korobkovart/site/src/components/EmptyState.tsx
 *   - pd-private/next/src/components/shared/empty-state.tsx (re-exports as default-named)
 *   - sh-private/src/components/empty-state.tsx (re-exports as default-named)
 *
 * Keep in lockstep — see vs-private/.claude/rules/css-tokens-sync.md §"Shared
 * components". Each project's copy must match this file (modulo import path
 * rewrites for cn/Button/Link).
 *
 * --- API ---
 * Backward-compatible union for `icon` and `action` so all 4 projects (which
 * historically had divergent shapes) can use this canon without breaking
 * existing call-sites:
 *
 *   icon — accepts:
 *     • a Lucide-style component (`Plus`, `Inbox`, etc.)
 *     • a rendered ReactNode (`<svg .../>`, `<MyIcon/>`)
 *     • undefined (no icon block rendered)
 *
 *   action — accepts:
 *     • { label, href?, onClick? } — JF canon, builds a styled Button for you
 *     • a ReactNode — drop in your own `<Button/>` or `<Link/>` element
 *     • undefined (no CTA)
 *
 *   compact — tightens vertical padding (`py-6` vs `py-16`) for card widgets.
 */

type IconProp = ElementType | ReactNode;
type ActionProp =
  | { label: string; href?: string; onClick?: () => void }
  | ReactNode;

interface EmptyStateProps {
  icon?: IconProp;
  title: string;
  description?: string;
  action?: ActionProp;
  compact?: boolean;
  className?: string;
  children?: ReactNode;
}

function isActionConfig(
  a: ActionProp | undefined,
): a is { label: string; href?: string; onClick?: () => void } {
  return (
    !!a &&
    typeof a === "object" &&
    !isValidElement(a) &&
    "label" in (a as object)
  );
}

function renderIcon(icon: IconProp | undefined): ReactNode | null {
  if (!icon) return null;
  // ReactNode form (e.g. <svg/>, <Icon/>) — render as-is, wrapped.
  if (isValidElement(icon)) {
    return (
      <div className="mb-4 rounded-full bg-muted p-4 inline-flex">{icon}</div>
    );
  }
  // ElementType form — instantiate with default sizing classes.
  if (typeof icon === "function" || typeof icon === "object") {
    const Icon = icon as ElementType;
    return (
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }
  return null;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-4",
        compact ? "py-6" : "py-16",
        className,
      )}
    >
      {renderIcon(icon)}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
      {action && (
        <div className="mt-6">
          {isActionConfig(action) ? (
            action.href ? (
              <Link href={action.href}>
                <Button variant="default">{action.label}</Button>
              </Link>
            ) : (
              <Button variant="default" onClick={action.onClick}>
                {action.label}
              </Button>
            )
          ) : (
            (action as ReactNode)
          )}
        </div>
      )}
    </div>
  );
}
