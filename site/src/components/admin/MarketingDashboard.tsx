"use client";

import { useState, useEffect } from "react";

type Tab = "analytics" | "seo" | "social" | "advertising";

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2 py-1">
      <span className={`mt-0.5 w-5 h-5 flex items-center justify-center text-xs font-bold rounded ${checked ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
        {checked ? "\u2713" : "\u2717"}
      </span>
      <span className="text-sm">{label}</span>
    </li>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {children}
    </a>
  );
}

function AnalyticsTab() {
  const [ga4Id, setGa4Id] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setGa4Id(data.ga4MeasurementId || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-secondary">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold tracking-wider uppercase mb-3">Google Analytics 4 Setup</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-secondary">
          <li>
            Go to{" "}
            <ExternalLink href="https://analytics.google.com">analytics.google.com</ExternalLink>{" "}
            and create a property for ko.taras.cloud
          </li>
          <li>Get your Measurement ID (format: G-XXXXXXX)</li>
          <li>
            Enter it in{" "}
            <a href="/admin/settings" className="text-blue-600 hover:underline">
              Settings
            </a>{" "}
            under &quot;GA4 Measurement ID&quot;
          </li>
        </ol>
      </div>

      {ga4Id ? (
        <div className="p-4 border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-800 dark:text-green-400">
            GA4 Connected: <code className="font-mono">{ga4Id}</code>
          </p>
          <p className="text-sm text-green-700 dark:text-green-400 mt-2">
            View your dashboard:{" "}
            <ExternalLink href={`https://analytics.google.com/analytics/web/#/p${ga4Id.replace("G-", "")}/reports/reportinghub`}>
              Open Google Analytics
            </ExternalLink>
          </p>
        </div>
      ) : (
        <div className="p-4 border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-400">
            Connect Google Analytics to see visitor stats. Add your GA4 Measurement ID in Settings.
          </p>
        </div>
      )}
    </div>
  );
}

function SeoTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold tracking-wider uppercase mb-3">SEO Checklist</h3>
      <ul className="space-y-1">
        <CheckItem checked label="Sitemap.xml configured (/sitemap.xml)" />
        <CheckItem checked label="Robots.txt configured (/robots.txt)" />
        <CheckItem checked label="OG images for artworks (/api/og/[slug])" />
        <CheckItem checked label="Structured data (JSON-LD ArtGallery + VisualArtwork)" />
        <CheckItem checked label="Meta descriptions on all pages" />
        <CheckItem checked label="hreflang alternates (en / es / ua)" />
        <CheckItem checked label="Google Search Console — see instructions below" />
        <CheckItem checked={false} label="Google Business Profile — see instructions below" />
      </ul>

      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <h4 className="text-sm font-medium mb-2">Google Search Console</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-secondary">
            <li>
              Go to{" "}
              <ExternalLink href="https://search.google.com/search-console">
                search.google.com/search-console
              </ExternalLink>
            </li>
            <li>Add property: <code className="font-mono text-xs bg-muted px-1">https://ko.taras.cloud</code></li>
            <li>Verify via DNS TXT record in Cloudflare (recommended)</li>
            <li>Submit sitemap: <code className="font-mono text-xs bg-muted px-1">https://ko.taras.cloud/sitemap.xml</code></li>
          </ol>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Google Business Profile</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-secondary">
            <li>
              Go to{" "}
              <ExternalLink href="https://business.google.com">
                business.google.com
              </ExternalLink>
            </li>
            <li>Create profile as &quot;Art Gallery&quot; or &quot;Artist&quot; business type</li>
            <li>Add website URL, photos of artworks, business hours</li>
            <li>This helps appear in local search results and Google Maps</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function SocialTab() {
  const platforms = [
    {
      name: "Instagram",
      url: "https://instagram.com/korobkov.art",
      status: "Active",
      active: true,
      instructions: null,
    },
    {
      name: "Saatchi Art",
      url: "https://www.saatchiart.com",
      status: "Not set up",
      active: false,
      instructions: [
        "Go to saatchiart.com and create an artist profile",
        "Upload high-quality images of available artworks",
        "Set prices in USD (they handle payments and shipping)",
        "Commission: 35% on sales",
      ],
    },
    {
      name: "Artsy",
      url: "https://www.artsy.net/gallery-partnerships",
      status: "Not set up",
      active: false,
      instructions: [
        "Apply for gallery/artist partnership at artsy.net",
        "Requires portfolio review and approval process",
        "Best for established artists with exhibition history",
        "They handle collector relationships and payments",
      ],
    },
    {
      name: "Pinterest Business",
      url: "https://business.pinterest.com",
      status: "Not set up",
      active: false,
      instructions: [
        "Create a business account at business.pinterest.com",
        "Claim your website for rich pins",
        "Create boards for each series (Podilia, Destruction, Murals, etc.)",
        "Pin each artwork with link back to ko.taras.cloud",
        "Pinterest drives significant traffic for visual art",
      ],
    },
    {
      name: "Google Arts & Culture",
      url: "https://artsandculture.google.com/partner",
      status: "Not set up",
      active: false,
      instructions: [
        "Apply through the Google Arts & Culture partner program",
        "Typically requires institutional backing or notable exhibitions",
        "Provides high-resolution virtual gallery experience",
        "Great for long-term brand visibility",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold tracking-wider uppercase mb-3">Art Platforms & Social Media</h3>
      <div className="space-y-4">
        {platforms.map((p) => (
          <div key={p.name} className="border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">
                <ExternalLink href={p.url}>{p.name}</ExternalLink>
              </h4>
              <span
                className={`text-xs px-2 py-0.5 ${
                  p.active
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {p.status}
              </span>
            </div>
            {p.instructions && (
              <ol className="list-decimal list-inside space-y-1 text-sm text-secondary">
                {p.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdvertisingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold tracking-wider uppercase mb-3">Google Ads</h3>
        <div className="border border-border p-4 space-y-3">
          <p className="text-sm text-secondary">
            <ExternalLink href="https://ads.google.com">ads.google.com</ExternalLink>
          </p>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-secondary mb-1">
              Recommended Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "buy contemporary ukrainian art",
                "mural artist spain",
                "original paintings for sale",
                "korobkov art",
                "ukrainian artist cordoba",
                "contemporary art online gallery",
              ].map((kw) => (
                <span key={kw} className="text-xs bg-muted px-2 py-1 font-mono">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-secondary">
            Suggested budget: start with 5-10 EUR/day on Search campaigns targeting art collectors.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-wider uppercase mb-3">Meta Ads (Instagram / Facebook)</h3>
        <div className="border border-border p-4 space-y-3">
          <p className="text-sm text-secondary">
            <ExternalLink href="https://business.facebook.com">business.facebook.com</ExternalLink>
          </p>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-secondary mb-1">
              Ad Format
            </p>
            <p className="text-sm text-secondary">
              Carousel ads showcasing artwork images work best for visual art. Each card links to the artwork page.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-secondary mb-1">
              Target Audiences
            </p>
            <ul className="list-disc list-inside text-sm text-secondary space-y-1">
              <li>Art collectors and gallery visitors</li>
              <li>Interior designers and decorators</li>
              <li>Contemporary art enthusiasts</li>
              <li>Lookalike audience based on website visitors (requires GA4 + Meta Pixel)</li>
            </ul>
          </div>
          <p className="text-sm text-secondary">
            Suggested budget: start with 5-10 EUR/day. Focus on Instagram placement for visual impact.
          </p>
        </div>
      </div>
    </div>
  );
}

export function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  const tabs: { id: Tab; label: string }[] = [
    { id: "analytics", label: "Analytics" },
    { id: "seo", label: "SEO Checklist" },
    { id: "social", label: "Social Media" },
    { id: "advertising", label: "Advertising" },
  ];

  return (
    <div>
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-foreground text-foreground font-medium"
                : "text-secondary hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "seo" && <SeoTab />}
        {activeTab === "social" && <SocialTab />}
        {activeTab === "advertising" && <AdvertisingTab />}
      </div>
    </div>
  );
}
