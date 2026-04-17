import { getTranslations } from "next-intl/server";

import { Mail, MessageCircle, Send } from "lucide-react";


function InstagramIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const socials = [
    {
      name: "Instagram",
      icon: InstagramIcon,
      href: "https://www.instagram.com/korobkov.art",
      label: "@korobkov.art",
      color: "hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400",
    },
    {
      name: "Telegram",
      icon: Send,
      href: "https://t.me/Korobkov_art",
      label: "@Korobkov_art",
      color: "hover:bg-[#0088cc]",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/34658573627",
      label: "+34 658 57 36 27",
      color: "hover:bg-[#25D366]",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:Korobkovartstudio@gmail.com",
      label: "Korobkovartstudio@gmail.com",
      color: "hover:bg-foreground",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Video */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/contact.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Social links */}
        <div className="flex flex-col items-center lg:items-start gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-2">Mykhailo & Olha Korobkov</h2>
            <p className="text-secondary">Valencia, Spain</p>
          </div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 p-5 border border-border transition-all duration-300 ${social.color} hover:text-white hover:border-transparent`}
            >
              <social.icon
                size={28}
                strokeWidth={1.5}
                className="flex-shrink-0"
              />
              <div>
                <p className="font-bold text-sm tracking-wider uppercase">
                  {social.name}
                </p>
                <p className="text-xs opacity-70 mt-0.5">{social.label}</p>
              </div>
            </a>
          ))}
        </div>

          <p className="text-sm text-secondary text-center lg:text-left max-w-sm">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
