import { getTranslations } from "next-intl/server";
import { exhibitions } from "@/data/exhibitions";

export default async function ExhibitionsPage() {
  const t = await getTranslations("exhibitions");
  const joint = exhibitions.filter((e) => e.type === "joint");
  const personal = exhibitions.filter((e) => e.type === "personal");

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-[0.2em] uppercase mb-16">
        {t("title")}
      </h1>

      {/* Personal */}
      <section className="mb-20">
        <h2 className="text-lg font-semibold tracking-[0.2em] uppercase mb-10">
          {t("personal")}
        </h2>
        <div className="space-y-0">
          {personal
            .sort((a, b) => b.year - a.year)
            .map((ex) => (
              <ExhibitionItem key={ex.id} exhibition={ex} />
            ))}
        </div>
      </section>

      {/* Joint */}
      <section>
        <h2 className="text-lg font-semibold tracking-[0.2em] uppercase mb-10">
          {t("joint")}
        </h2>
        <div className="space-y-0">
          {joint
            .sort((a, b) => b.year - a.year)
            .map((ex) => (
              <ExhibitionItem key={ex.id} exhibition={ex} />
            ))}
        </div>
      </section>
    </div>
  );
}

function ExhibitionItem({
  exhibition,
}: {
  exhibition: (typeof exhibitions)[0];
}) {
  return (
    <div className="flex gap-6 py-5 border-b border-border group hover:bg-muted/30 transition-colors duration-300 px-2 -mx-2">
      <span className="text-sm text-secondary min-w-[80px] tabular-nums">
        {exhibition.date}
      </span>
      <div>
        <h3 className="font-medium text-sm tracking-wide">{exhibition.title}</h3>
        <p className="text-sm text-secondary mt-0.5">
          {exhibition.venue}, {exhibition.city}, {exhibition.country}
        </p>
      </div>
    </div>
  );
}
