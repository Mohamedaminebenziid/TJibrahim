import { getContent } from "@/lib/content";
import { PageHeader, Btn, Field } from "@/components/admin/Toolbar";
import { saveSiteText, saveStats } from "./actions";

export default async function ContentPage() {
  const c = await getContent();

  return (
    <>
      <PageHeader title="Website Content" subtitle="Edit every piece of text shown on the public site." />
      <div className="space-y-16">
        <Section title="Hero">
          <form action={saveSiteText} className="space-y-4 border hairline p-6">
            <input type="hidden" name="__key" value="hero" />
            <Field label="Name / Brand" name="name" defaultValue={c.hero.name} />
            <Field label="Role" name="role" defaultValue={c.hero.role} />
            <Field label="Tagline" name="tagline" defaultValue={c.hero.tagline} textarea rows={2} />
            <Field label="CTA button text" name="cta" defaultValue={c.hero.cta} />
            <Field
              label="Hero video URL"
              name="video_url"
              defaultValue={c.hero.video_url}
              placeholder="Leave empty to use the bundled hero.mp4"
              hint="Upload a video in Media Library, copy its public URL, and paste it here."
            />
            <Btn type="submit" variant="solid">Save hero</Btn>
          </form>
        </Section>

        <Section title="About">
          <form action={saveStats} className="space-y-4 border hairline p-6">
            <Field label="Heading" name="heading" defaultValue={c.about.heading} />
            <Field label="Biography" name="bio" defaultValue={c.about.bio} textarea rows={6} />
            <Field label="Specialties (comma separated)" name="specialties" defaultValue={c.about.specialties.join(", ")} />
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">Stats</div>
              <div className="grid gap-3">
                {[0, 1, 2, 3].map((i) => {
                  const s = c.about.stats[i];
                  return (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <input name="stat_value" defaultValue={s?.value ?? ""} placeholder="Value (e.g. 6+)" className="bg-transparent border hairline focus:border-white outline-none px-3 py-2 text-sm" />
                      <input name="stat_label" defaultValue={s?.label ?? ""} placeholder="Label (e.g. Years)" className="bg-transparent border hairline focus:border-white outline-none px-3 py-2 text-sm" />
                    </div>
                  );
                })}
              </div>
            </div>
            <Btn type="submit" variant="solid">Save about</Btn>
          </form>
        </Section>

        <Section title="Work / Portfolio">
          <form action={saveSiteText} className="space-y-4 border hairline p-6">
            <input type="hidden" name="__key" value="work" />
            <Field label="Heading" name="heading" defaultValue={c.work.heading} />
            <Field label="Introduction" name="intro" defaultValue={c.work.intro} textarea rows={2} />
            <Btn type="submit" variant="solid">Save</Btn>
          </form>
        </Section>

        <Section title="Brands section">
          <form action={saveSiteText} className="space-y-4 border hairline p-6">
            <input type="hidden" name="__key" value="brands" />
            <Field label="Heading" name="heading" defaultValue={c.brands.heading} />
            <Field label="Introduction" name="intro" defaultValue={c.brands.intro} />
            <Btn type="submit" variant="solid">Save</Btn>
          </form>
        </Section>

        <Section title="Footer">
          <form action={saveSiteText} className="space-y-4 border hairline p-6">
            <input type="hidden" name="__key" value="footer" />
            <Field label="Footer text" name="text" defaultValue={c.footer.text} />
            <Btn type="submit" variant="solid">Save</Btn>
          </form>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">{title}</h2>
      {children}
    </section>
  );
}
