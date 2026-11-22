import { getContent } from "@/lib/content";
import { PageHeader, Btn, Field } from "@/components/admin/Toolbar";
import { saveSiteText } from "../content/actions";

export default async function SEOPage() {
  const { seo } = await getContent();
  return (
    <>
      <PageHeader title="SEO Settings" subtitle="Default metadata and sharing image for the whole site." />
      <form action={saveSiteText} className="space-y-5 border hairline p-6 max-w-2xl">
        <input type="hidden" name="__key" value="seo" />
        <Field label="Site title" name="title" defaultValue={seo.title} />
        <Field label="Meta description" name="description" defaultValue={seo.description} textarea rows={3} />
        <Field label="Social sharing image URL" name="og_image" defaultValue={seo.og_image} placeholder="https://..." />
        <Btn type="submit" variant="solid">Save SEO</Btn>
      </form>
    </>
  );
}
