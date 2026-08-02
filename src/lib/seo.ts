import { faqs } from "./faqs";

export const SITE_URL = "https://mechanist.ir";
export const SITE_NAME = "مکانیست";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.jpg`;

const TITLE_HOME = "مکانیست | یادآوری هوشمند سرویس خودرو بر اساس کیلومتر و زمان";
const DESCRIPTION_HOME =
  "با مکانیست سرویس‌های خودرو، موتورسیکلت، کامیون و تراکتور را بر اساس کیلومتر و زمان به‌طور خودکار پیگیری کنید. ۵۰۰ نفر اول مادام‌العمر رایگان.";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "/" : normalized}`;
}

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
};

function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

/** Shared meta + canonical + OG/Twitter for a page. */
export function pageSeo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: PageSeoInput) {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "googlebot", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "fa_IR" },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: title },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: title },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "fa-IR", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
  };
}

export function homeSeo() {
  const base = pageSeo({
    title: TITLE_HOME,
    description: DESCRIPTION_HOME,
    path: "/",
  });

  return {
    ...base,
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/favicon.ico`,
            },
            image: DEFAULT_OG_IMAGE,
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
            inLanguage: "fa-IR",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "WebPage",
            "@id": `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: TITLE_HOME,
            description: DESCRIPTION_HOME,
            inLanguage: "fa-IR",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${SITE_URL}/#app` },
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: DEFAULT_OG_IMAGE,
            },
          },
          {
            "@type": "SoftwareApplication",
            "@id": `${SITE_URL}/#app`,
            name: SITE_NAME,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "iOS, Android",
            inLanguage: "fa-IR",
            url: SITE_URL,
            image: DEFAULT_OG_IMAGE,
            description: DESCRIPTION_HOME,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "IRR",
              description: "۵۰۰ نفر اول مادام‌العمر رایگان",
            },
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "FAQPage",
            "@id": `${SITE_URL}/#faq`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          },
        ],
      }),
    ],
  };
}

export function downloadSeo() {
  const title = "دریافت اپلیکیشن مکانیست | ثبت‌نام و دانلود";
  const description =
    "ایمیل یا شماره موبایلت را وارد کن تا لینک دانلود مکانیست برایت ارسال شود. ۵۰۰ نفر اول مادام‌العمر رایگان.";
  const base = pageSeo({ title, description, path: "/download" });

  return {
    ...base,
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: absoluteUrl("/download"),
        inLanguage: "fa-IR",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      }),
    ],
  };
}
