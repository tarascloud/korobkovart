import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/HeroSection";
import { ArtworkCard } from "@/components/ArtworkCard";
import { getFeaturedArtworks } from "@/lib/artworks";
import { Link } from "@/i18n/navigation";
import { Mail, MessageCircle, Send } from "lucide-react";

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
    { name: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/korobkov.art", label: "@korobkov.art" },
    { name: "Telegram", icon: Send, href: "https://t.me/Korobkov_art", label: "@Korobkov_art" },
    { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/34652285139", label: "+34 652 28 51 39" },
    { name: "Email", icon: Mail, href: "mailto:Korobkovartstudio@gmail.com", label: "Korobkovartstudio@gmail.com" },
  ];

  return (
    <div>
      <HeroSection />

      {/* Featured Works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xl font-semibold tracking-tight uppercase [text-wrap:balance]">
            {t("featured")}
          </h2>
          <Link
            href="/gallery"
            className="text-sm text-secondary hover:text-foreground transition-colors duration-300 tracking-[0.15em] uppercase"
          >
            {t("view_all")} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((artwork, i) => (
            <ArtworkCard key={artwork.slug} artwork={artwork} index={i} />
          ))}
        </div>
      </section>

      {/* About section */}
      <section>
        <div className="max-w-4xl mx-auto px-6 py-24">
          <p className="leading-relaxed text-secondary text-base max-w-[65ch]">
            {tAbout("bio")}
          </p>
        </div>
        <div className="relative w-full mt-16">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about.jpg"
            alt={tAbout("artist_title")}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Contact section — overlaps about photo for seamless blend */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center -mt-48 sm:-mt-64">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/videos/contact.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-background via-background/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative max-w-md mx-auto px-6 pt-[45%] sm:pt-[35%] pb-24 flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold tracking-[0.15em] mb-2">Mykhailo & Olha Korobkov</h2>
            <p className="text-secondary text-sm tracking-wider">Valencia, Spain</p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 border border-foreground/20 backdrop-blur-sm bg-background/30 hover-tinted-shadow hover:bg-foreground hover:text-background hover:border-transparent transition-all duration-300 active:scale-[0.98]"
              >
                <social.icon size={24} strokeWidth={1.5} className="flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm tracking-[0.15em] uppercase">{social.name}</p>
                  <p className="text-xs opacity-60 mt-0.5">{social.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
