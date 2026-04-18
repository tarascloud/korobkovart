import { getLocale } from "next-intl/server";
import { ScrollReveal } from "@/components/ScrollReveal";

const content = {
  ua: {
    title: "KOROBKOV ART STUDIO — CV",
    biography: "Біографія",
    biographyText: [
      "Korobkov Art Studio — творче об'єднання українських художників Михайла та Ольги Коробкових, які працюють разом із 2017 року. Народжені в Україні та нині базовані в Кордобі (Іспанія), вони створюють живопис, великі формати, мурали та інсталяції.",
      "У своїй художній практиці дует досліджує теми культурної ідентичності, імміграції та впливу нового середовища на внутрішній простір людини. Роботи Korobkov Art Studio поєднують образність та абстракцію, працюють із ритмом, кольором та жестом як інструментами візуального перекладу досвіду, пам'яті та емоційних трансформацій.",
      "Важливим елементом їхньої візуальної мови є використання орнаментів і повторюваних модулів — структур, що одночасно нагадують традиційні декоративні мотиви та цифрові патерни. Поєднуючи ручний живописний жест із ритмічними «візерунками», художники створюють простори, у яких перетинаються минуле і сучасне, матеріальне і цифрове, особисте й колективне.",
      "Роботи знаходяться в приватних колекціях США, Німеччини, Іспанії та України.",
    ],
    education: "Освіта",
    mykhailo: "Михайло Коробков",
    mykhailoEdu: [
      "Кримське художнє училище ім. Самокиша (художник-живописець), Україна",
      "Харківська державна академія дизайну і мистецтв (монументальний живопис), Україна",
    ],
    olha: "Ольга Коробкова",
    olhaEdu: [
      "Університет економіки і підприємництва (фінанси), Хмельницький, Україна",
    ],
    selectedProjects: "Обрані проєкти",
    projects: [
      {
        year: "2023",
        title: "Публічний мурал (8×12 м), Кордоба, Іспанія.",
        desc: "Великоформатна робота, що досліджує теми міграції, адаптації та емоційної картографії через ритм, колір та багатошаровий жест.",
      },
      {
        year: "2022",
        title: "Інсталяційний проєкт у Хмельницькому обласному художньому музеї, Україна.",
        desc: "Міждисциплінарна робота про культурну пам'ять, досвід переміщення та внутрішні трансформації, втілені через абстракцію й символічні форми.",
      },
      {
        year: "2021",
        title: "Арт-резиденція Helicon Art Center, Ізміт, Туреччина.",
        desc: "Участь у міжнародній резиденції, створення site-specific робіт, що інтегрують локальний контекст, матеріальність та тему міжкультурного діалогу.",
      },
    ],
    soloExhibitions: "Персональні виставки",
    solo: [
      "2025 — «Centro Cultural José Luis García Palacios», Кордоба, Іспанія",
      "2023 — «Galería Círculo de la Amistad», Кордоба, Іспанія",
      "2022 — Галерея «OKiS», Варшава, Польща",
      "2022 — Хмельницький обласний художній музей, Україна",
      "2019 — Представництво НАТО в Україні, Київ",
      "2017 — Арт-кафе «KavaLava», Хмельницький, Україна",
      "2013 — Львівський художній музей, Львів, Україна",
    ],
    groupExhibitions: "Групові виставки",
    group: [
      "2025 — «Baal Gallery», Мадрид, Іспанія",
      "2025 — «The Pop-Up Gallery», Амстердам, Нідерланди",
      "2022 — «BSMT Gallery», Лондон, Велика Британія",
      "2022 — Благодійний аукціон, Краків, Польща",
      "2021 — «Helicon Art Center», Ізміт, Туреччина",
      "2019 — Інститут проблем сучасного мистецтва України, Київ",
      "2018 — Національний комплекс «Експоцентр України», Київ",
      "2018 — «АКТ», Арт-завод «Платформа», Київ",
    ],
  },
  en: {
    title: "KOROBKOV ART STUDIO — CV",
    biography: "Biography",
    biographyText: [
      "Korobkov Art Studio is a creative duo formed by Ukrainian artists Mykhailo and Olha Korobkov, working together since 2017. Born in Ukraine and currently based in Córdoba, Spain, they create paintings, large-scale works, murals and installations.",
      "Their artistic practice explores themes of cultural identity, migration and the influence of new environments on the inner landscape of the human experience. The duo works with a hybrid language that combines figuration and abstraction, using rhythm, color and gesture as tools for translating memory, emotion and processes of personal transformation.",
      "A significant element of their visual language is the use of ornaments and repeated modules — structures that evoke both traditional decorative motifs and contemporary digital patterns. By merging expressive hand-painted gestures with rhythmic visual sequences, the artists create spaces where past and present, material and digital, personal and collective narratives intersect.",
      "Their works are held in private collections in the USA, Germany, France, Spain and Ukraine.",
    ],
    education: "Education",
    mykhailo: "Mykhailo Korobkov",
    mykhailoEdu: [
      "Samokysh Crimean Art College (Fine Arts, Painting), Ukraine",
      "Kharkiv State Academy of Design and Arts (Monumental Painting), Ukraine",
    ],
    olha: "Olha Korobkova",
    olhaEdu: [
      "University of Economics and Entrepreneurship (Finance), Khmelnytskyi, Ukraine",
    ],
    selectedProjects: "Selected Projects",
    projects: [
      {
        year: "2023",
        title: "Public mural (8×12 m), Córdoba, Spain.",
        desc: "Large-scale site-specific work exploring migration, adaptation and emotional cartography through layered gesture, rhythm and color.",
      },
      {
        year: "2022",
        title: "Installation project at the Khmelnytskyi Regional Art Museum, Ukraine.",
        desc: "An interdisciplinary work addressing cultural memory, displacement and inner transformation through abstraction and symbolic forms.",
      },
      {
        year: "2021",
        title: "Artist Residency, Helicon Art Center, Izmit, Turkey.",
        desc: "Participation in an international residency program; creation of site-responsive works integrating local context, materiality and cross-cultural dialogue.",
      },
    ],
    soloExhibitions: "Solo Exhibitions",
    solo: [
      "2025 — Centroculture José Luis García Palacios, Córdoba, Spain",
      "2023 — Galería Círculo de la Amistad, Córdoba, Spain",
      "2022 — OKiS Gallery, Warsaw, Poland",
      "2022 — Khmelnytskyi Regional Art Museum, Ukraine",
      "2019 — NATO Representation to Ukraine, Kyiv",
      "2017 — KavaLava Art Café, Khmelnytskyi, Ukraine",
      "2013 — Lviv Art Museum, Lviv, Ukraine",
    ],
    groupExhibitions: "Group Exhibitions",
    group: [
      "2025 — Baal Gallery, Madrid, Spain",
      "2025 — The Pop-Up Gallery, Amsterdam, Netherlands",
      "2022 — BSMT Gallery, London, UK",
      "2022 — Charity Auction, Krakow, Poland",
      "2021 — Helicon Art Center, Izmit, Turkey",
      "2019 — Institute of Contemporary Art Problems, Kyiv, Ukraine",
      "2018 — National Exhibition Center \"Expocenter of Ukraine\", Kyiv",
      "2018 — AKT, Art-Zavod Platforma, Kyiv",
    ],
  },
  es: {
    title: "KOROBKOV ART STUDIO — CV",
    biography: "Biografía",
    biographyText: [
      "Korobkov Art Studio is a creative duo formed by Ukrainian artists Mykhailo and Olha Korobkov, working together since 2017. Born in Ukraine and currently based in Córdoba, Spain, they create paintings, large-scale works, murals and installations.",
      "Their artistic practice explores themes of cultural identity, migration and the influence of new environments on the inner landscape of the human experience. The duo works with a hybrid language that combines figuration and abstraction, using rhythm, color and gesture as tools for translating memory, emotion and processes of personal transformation.",
      "A significant element of their visual language is the use of ornaments and repeated modules — structures that evoke both traditional decorative motifs and contemporary digital patterns. By merging expressive hand-painted gestures with rhythmic visual sequences, the artists create spaces where past and present, material and digital, personal and collective narratives intersect.",
      "Their works are held in private collections in the USA, Germany, France, Spain and Ukraine.",
    ],
    education: "Educación",
    mykhailo: "Mykhailo Korobkov",
    mykhailoEdu: [
      "Samokysh Crimean Art College (Fine Arts, Painting), Ukraine",
      "Kharkiv State Academy of Design and Arts (Monumental Painting), Ukraine",
    ],
    olha: "Olha Korobkova",
    olhaEdu: [
      "University of Economics and Entrepreneurship (Finance), Khmelnytskyi, Ukraine",
    ],
    selectedProjects: "Proyectos Seleccionados",
    projects: [
      {
        year: "2023",
        title: "Public mural (8×12 m), Córdoba, Spain.",
        desc: "Large-scale site-specific work exploring migration, adaptation and emotional cartography through layered gesture, rhythm and color.",
      },
      {
        year: "2022",
        title: "Installation project at the Khmelnytskyi Regional Art Museum, Ukraine.",
        desc: "An interdisciplinary work addressing cultural memory, displacement and inner transformation through abstraction and symbolic forms.",
      },
      {
        year: "2021",
        title: "Artist Residency, Helicon Art Center, Izmit, Turkey.",
        desc: "Participation in an international residency program; creation of site-responsive works integrating local context, materiality and cross-cultural dialogue.",
      },
    ],
    soloExhibitions: "Exposiciones Individuales",
    solo: [
      "2025 — Centroculture José Luis García Palacios, Córdoba, Spain",
      "2023 — Galería Círculo de la Amistad, Córdoba, Spain",
      "2022 — OKiS Gallery, Warsaw, Poland",
      "2022 — Khmelnytskyi Regional Art Museum, Ukraine",
      "2019 — NATO Representation to Ukraine, Kyiv",
      "2017 — KavaLava Art Café, Khmelnytskyi, Ukraine",
      "2013 — Lviv Art Museum, Lviv, Ukraine",
    ],
    groupExhibitions: "Exposiciones Colectivas",
    group: [
      "2025 — Baal Gallery, Madrid, Spain",
      "2025 — The Pop-Up Gallery, Amsterdam, Netherlands",
      "2022 — BSMT Gallery, London, UK",
      "2022 — Charity Auction, Krakow, Poland",
      "2021 — Helicon Art Center, Izmit, Turkey",
      "2019 — Institute of Contemporary Art Problems, Kyiv, Ukraine",
      "2018 — National Exhibition Center \"Expocenter of Ukraine\", Kyiv",
      "2018 — AKT, Art-Zavod Platforma, Kyiv",
    ],
  },
};

export default async function CvPage() {
  const locale = await getLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <ScrollReveal>
        <div className="h-[1px] bg-foreground/20 w-16 mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase leading-none mb-2">
          Korobkov
          <br />
          <span className="font-light text-secondary">Art Studio</span>
        </h1>
        <p className="text-sm text-secondary tracking-[0.2em] uppercase mt-3">
          Curriculum Vitae
        </p>
      </ScrollReveal>

      {/* Biography */}
      <section className="mt-20 mb-20 border-t border-border pt-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <ScrollReveal>
            <div className="md:sticky md:top-32">
              <h2 className="text-xl font-semibold tracking-tight uppercase">
                {t.biography}
              </h2>
              <div className="h-[1px] bg-border w-12 mt-4" />
            </div>
          </ScrollReveal>
          <div className="space-y-4 text-sm leading-relaxed text-secondary">
            {t.biographyText.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <p>{p}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mb-20 border-t border-border pt-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <ScrollReveal>
            <h2 className="text-xl font-semibold tracking-tight uppercase">
              {t.education}
            </h2>
            <div className="h-[1px] bg-border w-12 mt-4" />
          </ScrollReveal>
          <div>
            <ScrollReveal delay={0.08}>
              <div className="mb-8">
                <h3 className="font-medium text-sm mb-3 tracking-wide uppercase">{t.mykhailo}</h3>
                <ul className="space-y-1.5 text-sm text-secondary">
                  {t.mykhailoEdu.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-foreground/40">&#8226;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <div>
                <h3 className="font-medium text-sm mb-3 tracking-wide uppercase">{t.olha}</h3>
                <ul className="space-y-1.5 text-sm text-secondary">
                  {t.olhaEdu.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-foreground/40">&#8226;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Selected Projects */}
      <section className="mb-20 border-t border-border pt-16">
        <ScrollReveal>
          <h2 className="text-xl font-semibold tracking-tight uppercase mb-10">
            {t.selectedProjects}
          </h2>
        </ScrollReveal>
        <div className="space-y-0">
          {t.projects.map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(60px,auto)_1fr] gap-2 sm:gap-8 py-6 border-b border-border">
                <span className="text-sm text-secondary font-mono tabular-nums">
                  {p.year}
                </span>
                <div>
                  <h3 className="font-medium text-sm">{p.title}</h3>
                  <p className="text-sm text-secondary mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Solo Exhibitions */}
      <section className="mb-20 border-t border-border pt-16">
        <ScrollReveal>
          <h2 className="text-xl font-semibold tracking-tight uppercase mb-10">
            {t.soloExhibitions}
          </h2>
        </ScrollReveal>
        <div className="space-y-0">
          {t.solo.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="py-3 border-b border-border text-sm text-secondary hover:text-foreground transition-colors">
                {item}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Group Exhibitions */}
      <section className="border-t border-border pt-16">
        <ScrollReveal>
          <h2 className="text-xl font-semibold tracking-tight uppercase mb-10">
            {t.groupExhibitions}
          </h2>
        </ScrollReveal>
        <div className="space-y-0">
          {t.group.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="py-3 border-b border-border text-sm text-secondary hover:text-foreground transition-colors">
                {item}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
