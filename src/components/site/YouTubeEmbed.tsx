import { youtubeEmbed } from "@/lib/utils";

export default function YouTubeEmbed({ url, title }: { url: string; title?: string }) {
  const src = youtubeEmbed(url);
  if (!src) return null;
  return (
    <div className="relative aspect-video w-full bg-white">
      <iframe
        src={src}
        title={title || "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
