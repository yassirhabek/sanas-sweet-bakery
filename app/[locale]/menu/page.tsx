import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageBanner } from "@/components/public/PageBanner";
import { MenuBrowser } from "@/components/public/MenuBrowser";
import { getMenuWithCategories } from "@/lib/hours";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "menu" });
  return { title: t("title") };
}

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("menu");
  const categories = await getMenuWithCategories();

  return (
    <>
      <PageBanner title={t("title")} />

      <div className="page-container py-10 sm:py-14 md:py-20">
        <MenuBrowser categories={categories} locale={locale} />
      </div>
    </>
  );
}
