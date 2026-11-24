import ProjectGrid from "@/components/site/ProjectGrid";
import Reveal from "@/components/site/Reveal";
import { getCategories, getContent, getProjects } from "@/lib/content";

export const revalidate = 60;

export default async function WorkPage() {
  const [content, categories, projects] = await Promise.all([
    getContent(),
    getCategories(),
    getProjects(),
  ]);

  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <Reveal>
        <div className="text-[11px] tracking-[0.3em] uppercase text-black/50 mb-3">
          {content.work.heading}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-8xl tracking-tight leading-[0.95] break-words">Work</h1>
        <p className="mt-6 max-w-xl text-black/70">{content.work.intro}</p>
      </Reveal>
      <div className="mt-16">
        <ProjectGrid projects={projects} categories={categories} />
      </div>
    </section>
  );
}
