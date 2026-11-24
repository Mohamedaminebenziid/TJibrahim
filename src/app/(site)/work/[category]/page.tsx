import { notFound } from "next/navigation";
import ProjectGrid from "@/components/site/ProjectGrid";
import Reveal from "@/components/site/Reveal";
import { getCategories, getProjects } from "@/lib/content";

export const revalidate = 60;

export default async function CategoryPage({ params }: PageProps<"/work/[category]">) {
  const { category } = await params;
  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects({ categorySlug: category }),
  ]);
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <Reveal>
        <div className="text-[11px] tracking-[0.3em] uppercase text-black/50 mb-3">Category</div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-8xl tracking-tight leading-[0.95] break-words">{cat.name}</h1>
        {cat.description && <p className="mt-6 max-w-xl text-black/70">{cat.description}</p>}
      </Reveal>
      <div className="mt-16">
        <ProjectGrid
          projects={projects}
          categories={categories}
          initialCategory={cat.slug}
          showFilters={false}
        />
      </div>
    </section>
  );
}
