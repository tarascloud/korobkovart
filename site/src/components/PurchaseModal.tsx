"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateShipping,
  countries,
  type ShippingQuote,
  type ShippingCarrier,
} from "@/lib/shipping";
import { getImageUrl } from "@/lib/r2";
import type { Artwork } from "@/lib/types";

interface SavedAddress {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  zip: string;
  phone: string | null;
}

export function PurchaseModal({
  artwork,
  open,
  onClose,
}: {
  artwork: Artwork;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("purchase");
  const locale = useLocale();
  const [step, setStep] = useState<"shipping" | "details" | "confirm">("shipping");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<ShippingCarrier | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetch("/api/account/addresses")
        .then((r) => (r.ok ? r.json() : []))
        .then((addrs: SavedAddress[]) => setSavedAddresses(addrs))
        .catch(() => setSavedAddresses([]));
    }
  }, [open]);

  function handleCalculate() {
    if (!country) return;
    const q = calculateShipping(artwork.dimensions, country, locale);
    setQuote(q);
    setSelectedCarrier(q.carriers[0] || null);
  }

  function handleSelectCarrier(carrier: ShippingCarrier) {
    setSelectedCarrier(carrier);
  }

  function handleProceed() {
    if (!selectedCarrier) return;
    setStep("details");
  }

  async function handleSubmit() {
    if (!name || !email || !selectedCarrier) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "purchase",
          name,
          email,
          phone,
          artworkId: artwork.id,
          carrier: selectedCarrier.name,
          shippingCost: selectedCarrier.price,
          subject: `Purchase: ${artwork.title}`,
          message: [
            `Artwork: ${artwork.title} (${artwork.year})`,
            `Dimensions: ${artwork.dimensions}`,
            `Shipping to: ${address}, ${city}, ${zip}, ${country}`,
            `Carrier: ${selectedCarrier.name}`,
            `Shipping cost: €${selectedCarrier.price}`,
            `Estimated delivery: ${selectedCarrier.estimatedDays} days`,
          ].join("\n"),
        }),
      });
      const data = await res.json();
      if (data.orderId) {
        setOrderId(data.orderId);
      }
      setSubmitted(true);
      setStep("confirm");
    } catch {
      // still show confirm
      setSubmitted(true);
      setStep("confirm");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setStep("shipping");
    setQuote(null);
    setSelectedCarrier(null);
    setSubmitted(false);
    setOrderId(null);
    onClose();
  }

  const sortedCountries = [...countries].sort((a, b) => {
    const nameA = a.name[locale as keyof typeof a.name] || a.name.en;
    const nameB = b.name[locale as keyof typeof b.name] || b.name.en;
    return nameA.localeCompare(nameB);
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-background border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold tracking-wider uppercase">
                {t("title")}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t("close")}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-secondary hover:text-foreground rounded-full focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                <span aria-hidden="true" className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <div className="p-6">
              {/* Artwork summary */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-20 h-24 bg-muted relative flex-shrink-0 overflow-hidden">
                  <img
                    src={getImageUrl(artwork.image)}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{artwork.title}</h3>
                  <p className="text-xs text-secondary mt-1">
                    {artwork.year} &middot; {artwork.dimensions}
                  </p>
                  <p className="text-sm font-bold mt-2">{t("price_on_request")}</p>
                </div>
              </div>

              {/* Step: Shipping */}
              {step === "shipping" && (
                <div className="space-y-4">
                  <h3 className="font-medium">{t("shipping_address")}</h3>

                  {savedAddresses.length > 0 && (
                    <div className="space-y-2 mb-2">
                      <h4 className="text-sm font-medium text-secondary">
                        {t("saved_addresses")}
                      </h4>
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setCountry(addr.country);
                            setCity(addr.city);
                            setAddress(addr.address);
                            setZip(addr.zip);
                            setQuote(null);
                            setSelectedCarrier(null);
                          }}
                          className="w-full p-3 border border-border text-left text-sm hover:border-foreground transition-colors"
                        >
                          <p className="font-medium">{addr.name}</p>
                          <p className="text-secondary">
                            {addr.address}, {addr.city}, {addr.zip}, {addr.country}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      {t("country")}
                    </label>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setQuote(null);
                        setSelectedCarrier(null);
                      }}
                      className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors"
                    >
                      <option value="">{t("select_country")}</option>
                      {sortedCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name[locale as keyof typeof c.name] || c.name.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      {t("city")}
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      {t("address")}
                    </label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      {t("zip")}
                    </label>
                    <input
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors"
                    />
                  </div>

                  {/* Calculate button */}
                  <button
                    onClick={handleCalculate}
                    disabled={!country}
                    className="w-full py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-30"
                  >
                    {t("calculate_shipping")}
                  </button>

                  {/* Shipping options */}
                  {quote && (
                    <div className="mt-6 space-y-3">
                      <div className="text-sm text-secondary space-y-1">
                        <div className="flex justify-between">
                          <span>{t("region")}</span>
                          <span>{quote.regionName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("packed_size")}</span>
                          <span>{quote.packedDimensions.height}x{quote.packedDimensions.width}x{quote.packedDimensions.depth} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("weight")}</span>
                          <span>{quote.actualWeight} kg ({t("volumetric")}: {quote.volumetricWeight} kg)</span>
                        </div>
                        <div className="flex justify-between font-medium text-foreground">
                          <span>{t("billable_weight")}</span>
                          <span>{quote.billableWeight} kg</span>
                        </div>
                      </div>

                      <h4 className="font-medium mt-4">{t("choose_carrier")}</h4>

                      <div className="space-y-2">
                        {quote.carriers.map((carrier) => (
                          <button
                            key={carrier.id}
                            onClick={() => handleSelectCarrier(carrier)}
                            className={`w-full p-4 border text-left transition-colors ${
                              selectedCarrier?.id === carrier.id
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{carrier.name}</span>
                                <p className="text-xs text-secondary mt-1">
                                  {carrier.estimatedDays} {t("days")}
                                </p>
                              </div>
                              <span className="text-lg font-bold">
                                €{carrier.price}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleProceed}
                        disabled={!selectedCarrier}
                        className="w-full py-3 mt-4 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-30"
                      >
                        {t("proceed")}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step: Contact Details */}
              {step === "details" && (
                <div className="space-y-4">
                  <h3 className="font-medium">{t("your_details")}</h3>

                  {selectedCarrier && (
                    <div className="p-3 bg-muted text-sm">
                      <span className="font-medium">{selectedCarrier.name}</span>
                      {" — "}€{selectedCarrier.price}
                      {" — "}{selectedCarrier.estimatedDays} {t("days")}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      {t("name")}
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-1">
                      {t("phone")}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors"
                    />
                  </div>

                  <p className="text-xs text-secondary">{t("contact_note")}</p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setStep("shipping")}
                      className="flex-1 py-3 border border-border text-sm tracking-wider uppercase hover:border-foreground transition-colors"
                    >
                      {t("back")}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!name || !email || submitting}
                      className="flex-1 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-30"
                    >
                      {submitting ? "..." : t("submit_order")}
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Confirmation */}
              {step === "confirm" && submitted && (
                <div className="text-center py-8 space-y-4">
                  <motion.div
                    className="mx-auto w-16 h-16 rounded-full border-2 border-foreground/20 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <motion.svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <motion.path
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                      />
                    </motion.svg>
                  </motion.div>
                  <h3 className="text-lg font-bold">{t("order_received")}</h3>
                  {orderId && (
                    <p className="text-xs text-secondary font-mono">
                      Order #{orderId.slice(-8).toUpperCase()}
                    </p>
                  )}
                  <p className="text-sm text-secondary">{t("order_note")}</p>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-8 py-3 bg-foreground text-background text-sm tracking-wider uppercase"
                  >
                    {t("close")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
