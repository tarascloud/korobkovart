import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/HeroSection";
import { ArtworkCard } from "@/components/ArtworkCard";
import { getFeaturedArtworks } from "@/lib/artworks";
import { Link } from "@/i18n/navigation";
import { Mail, MessageCircle, Send, ChevronsDown } from "lucide-react";

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const tAbout = await getTranslations("about");
  const featured = await getFeaturedArtworks();

  const socials = [
    { name: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/korobkov.art", label: "@korobkov.art", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400" },
    { name: "Telegram", icon: Send, href: "https://t.me/Korobkov_art", label: "@Korobkov_art", color: "hover:bg-[#0088cc]" },
    { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/34658573627", label: "+34 658 57 36 27", color: "hover:bg-[#25D366]" },
    { name: "Email", icon: Mail, href: "mailto:Korobkovartstudio@gmail.com", label: "Korobkovartstudio@gmail.com", color: "hover:bg-foreground" },
  ];

  return (
    <div>
      <HeroSection />

      {/* Featured Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold tracking-wider uppercase">
            {t("featured")}
          </h2>
          <Link
            href="/gallery"
            className="text-sm text-secondary hover:text-foreground transition-colors tracking-wider uppercase"
          >
            {t("view_all")} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((artwork) => (
            <ArtworkCard key={artwork.slug} artwork={artwork} />
          ))}
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex justify-center py-6">
        <ChevronsDown size={24} strokeWidth={1.5} className="text-secondary animate-bounce" />
      </div>

      {/* About section */}
      <section>
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <p className="leading-relaxed text-secondary text-sm sm:text-base">
            {tAbout("bio")}
          </p>
        </div>
        <div className="flex justify-center py-6">
          <ChevronsDown size={24} strokeWidth={1.5} className="text-secondary animate-bounce" />
        </div>
        <div className="relative w-full">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-background to-transparent z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about.jpg"
            alt={tAbout("artist_title")}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Contact section */}
      <section className="relative min-h-screen flex items-center justify-center -mt-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/videos/contact.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-background via-background/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative max-w-md mx-auto px-6 py-16 flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Mykhailo & Olha Korobkov</h2>
            <p className="text-secondary">Valencia, Spain</p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 p-5 border border-foreground/20 backdrop-blur-sm bg-background/30 transition-all duration-300 ${social.color} hover:text-white hover:border-transparent`}
              >
                <social.icon size={28} strokeWidth={1.5} className="flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm tracking-wider uppercase">{social.name}</p>
                  <p className="text-xs opacity-70 mt-0.5">{social.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
