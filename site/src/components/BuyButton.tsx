"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PurchaseModal } from "./PurchaseModal";
import type { Artwork } from "@/lib/types";

export function BuyButton({ artwork }: { artwork: Artwork }) {
  const t = useTranslations("purchase");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 bg-foreground text-background text-sm tracking-wider uppercase font-bold hover:opacity-90 transition-opacity"
      >
        {t("buy_now")}
      </button>
      <PurchaseModal
        artwork={artwork}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
