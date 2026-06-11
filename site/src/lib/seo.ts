const BASE_URL = "https://ko.taras.cloud";

/**
 * Self-referencing canonical + hreflang alternates for a page.
 * НІКОЛИ не ставити alternates.canonical у layout metadata — кожна сторінка
 * успадкує canonical головної і Google деіндексує її як дублікат.
 *
 * @param locale поточна locale (en | es | ua)
 * @param path шлях без locale, з провідним слешем ("" для головної, "/gallery/slug")
 */
export function pageAlternates(locale: string, path = "") {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      en: `${BASE_URL}/en${path}`,
      es: `${BASE_URL}/es${path}`,
      uk: `${BASE_URL}/ua${path}`,
      "x-default": `${BASE_URL}/en${path}`,
    },
  };
}
