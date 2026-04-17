import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Logo } from "@/components/Logo";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="relative w-full min-h-[calc(100vh-73px)] flex flex-col justify-between overflow-hidden">
      {/* Background Image */}
      <Image
        src="/about.jpg"
        alt={t("artist_title")}
        fill
        className="object-cover object-center -z-20"
        priority
      />

      {/* Gradients to ensure text readability against the vivid background picture */}
      <div className="absolute inset-0 top-0 bg-gradient-to-b from-background/90 via-background/30 to-transparent -z-10 h-[60vh]" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent -z-10 h-[60vh]" />

      {/* Top Header Content - Positioned above the paintings */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center text-center mt-4">
        <Logo size={64} showText={false} className="mb-8" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-widest uppercase mb-4 text-foreground drop-shadow-md">
          {t("artist_title")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-foreground/90 uppercase tracking-[0.15em] sm:tracking-[0.2em] max-w-3xl drop-shadow-sm">
          {t("artist_subtitle")}
        </p>
      </div>

      {/* Bottom Bio Content - Positioned underneath the objects */}
      <div className="relative z-10 p-8 md:px-12 lg:px-24 pb-12 md:pb-16 flex flex-col items-center text-center mt-auto">
        <p className="max-w-4xl text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-foreground/95 font-medium drop-shadow-sm selection:bg-foreground selection:text-background">
          {t("bio")}
        </p>
      </div>
    </div>
  );
}
