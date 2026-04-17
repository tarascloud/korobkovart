import { getTranslations } from "next-intl/server";
import { exhibitions } from "@/data/exhibitions";

export default async function ExhibitionsPage() {
  const t = await getTranslations("exhibitions");
  const joint = exhibitions.filter((e) => e.type === "joint");
  const personal = exhibitions.filter((e) => e.type === "personal");

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-wider uppercase mb-12">
        {t("title")}
      </h1>

      {/* Personal */}
      <section className="mb-16">
        <h2 className="text-xl font-bold tracking-wider uppercase mb-8">
          {t("personal")}
        </h2>
        <div className="space-y-6">
          {personal
            .sort((a, b) => b.year - a.year)
            .map((ex) => (
              <ExhibitionItem key={ex.id} exhibition={ex} />
            ))}
        </div>
      </section>

      {/* Joint */}
      <section>
        <h2 className="text-xl font-bold tracking-wider uppercase mb-8">
          {t("joint")}
        </h2>
        <div className="space-y-6">
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
    <div className="flex gap-6 py-4 border-b border-border">
      <span className="text-sm text-secondary min-w-[80px]">
        {exhibition.date}
      </span>
      <div>
        <h3 className="font-medium">{exhibition.title}</h3>
        <p className="text-sm text-secondary">
          {exhibition.venue}, {exhibition.city}, {exhibition.country}
        </p>
      </div>
    </div>
  );
}
