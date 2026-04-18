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

export default function ContactPage() {
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
      href: "https://wa.me/34652285139",
      label: "+34 652 28 51 39",
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
    <div className="relative min-h-[80vh] flex items-center justify-center">
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
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content over video */}
      <div className="relative max-w-md mx-auto px-6 py-24 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-[0.15em] mb-2">Mykhailo & Olha Korobkov</h1>
          <p className="text-secondary text-sm tracking-wider">Valencia, Spain</p>
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
          ))}
        </div>

      </div>
    </div>
  );
}
