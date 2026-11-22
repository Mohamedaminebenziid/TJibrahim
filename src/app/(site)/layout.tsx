import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { getCategories, getContent, getSocialLinks } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [cats, content, socials] = await Promise.all([
    getCategories({ navOnly: true }),
    getContent(),
    getSocialLinks(),
  ]);
  return (
    <>
      <Nav categories={cats} />
      <main className="flex-1">{children}</main>
      <Footer content={content} socials={socials} />
    </>
  );
}
