"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <a
        href="/api/auth/signin"
        className="text-sm text-secondary hover:text-foreground transition-colors"
        title="Sign in"
      >
        <User size={20} strokeWidth={1.5} />
      </a>
    );
  }

  const isOwner = user.role === "OWNER";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full overflow-hidden border border-border"
      >
        {user.image ? (
          <img src={user.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-bold">
            {user.name?.[0] || "?"}
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-background border border-border shadow-lg z-50">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-secondary truncate">{user.email}</p>
            </div>
            {isOwner && (
              <a
                href="/en/admin"
                className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                Admin Panel
              </a>
            )}
            <a
              href="/en/account"
              className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              My Account
            </a>
            <a
              href="/api/auth/signout"
              className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-red-500"
            >
              Sign Out
            </a>
          </div>
        </>
      )}
    </div>
  );
}
