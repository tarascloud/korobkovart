"use client";

import { useEffect, useState } from "react";

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Telegram|TelegramBot|Twitter|Line\/|Snapchat|WhatsApp|Viber|Pinterest|LinkedIn/i.test(ua);
}

export function InAppBrowserGuard() {
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    setInApp(isInAppBrowser());
  }, []);

  if (!inApp) return null;

  const url = window.location.href;

  return (
    <div className="w-full p-4 border border-amber-500/30 bg-amber-500/10 text-sm space-y-3">
      <p className="font-medium">
        Google sign-in is not supported in this browser.
      </p>
      <p className="text-secondary text-xs">
        Please open this page in Safari or Chrome.
      </p>
      <div className="flex flex-col gap-2">
        <a
          href={`https://www.google.com/url?q=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 py-2 px-4 border border-border text-xs tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          Open in Browser
        </a>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(url);
          }}
          className="text-xs text-secondary underline"
        >
          Copy link
        </button>
      </div>
    </div>
  );
}
