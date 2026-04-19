import { Mail, MessageCircle, Send } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ContactPage() {
  const socials = [
    { name: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/korobkov.art", label: "@korobkov.art" },
    { name: "Telegram", icon: Send, href: "https://t.me/Korobkov_art", label: "@Korobkov_art" },
    { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/34652285139", label: "+34 652 28 51 39" },
    { name: "Email", icon: Mail, href: "mailto:Korobkovartstudio@gmail.com", label: "Korobkovartstudio@gmail.com" },
  ];

  return (
    <div className="relative min-h-[80vh] flex items-end sm:items-center px-6">
      {/* Background video */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/contact.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/40 sm:bg-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Left-aligned content -- asymmetric, mirrors hero pattern */}
      <div className="relative w-full max-w-7xl mx-auto pb-24 sm:pb-0">
        <div className="max-w-md">
          <ScrollReveal>
            <div className="h-[1px] bg-foreground/20 w-16 mb-6" />

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter leading-none uppercase mb-2">
              Mykhailo & Olha
              <br />
              <span className="font-light text-secondary">Korobkov</span>
            </h1>
            <p className="text-secondary text-sm tracking-[0.2em] uppercase mt-3">
              Valencia, Spain
            </p>
          </ScrollReveal>

          <div className="flex flex-col gap-4 w-full mt-10">
            {socials.map((social, i) => (
              <ScrollReveal key={social.name} delay={0.1 + i * 0.08}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 border border-foreground/20 backdrop-blur-sm bg-background/30 hover-tinted-shadow hover:bg-foreground hover:text-background hover:border-transparent transition-all duration-300 active:scale-[0.98]"
                >
                  <social.icon
                    size={24}
                    strokeWidth={1.5}
                    className="flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm tracking-[0.15em] uppercase">
                      {social.name}
                    </p>
                    <p className="text-xs opacity-60 mt-0.5">{social.label}</p>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
