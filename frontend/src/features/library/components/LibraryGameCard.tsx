import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import type { LibraryGameItem } from "../types";

export interface LibraryGameCardProps {
  game: LibraryGameItem;
  className?: string;
}

export function LibraryGameCard({ game, className }: LibraryGameCardProps) {
  const [imgError, setImgError] = React.useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80";

  return (
    <Link
      href={`/credentials/${game.id}`}
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden bg-deep-blue-900 border border-white/10",
        "transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40",
        "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50",
        className
      )}
      aria-label={`Buka akun ${game.title}`}
    >
      {/* Thumbnail Aspect 3:4 */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-deep-blue-950">
        <Image
          src={imgError ? fallbackImage : game.imageSrc || fallbackImage}
          alt={game.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />

        {/* Top Badges: Launcher & Pre-order */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {game.launcher && (
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-gray-200 border border-white/10">
              {game.launcher}
            </span>
          )}
          {game.isPreorder && (
            <Pill
              variant="warning"
              size="xs"
              className="bg-[#2B1B10] text-amber-500 border border-amber-900/40 ml-auto"
            >
              Pre-order
            </Pill>
          )}
        </div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex flex-col p-3.5 gap-2 flex-1 justify-between bg-deep-blue-900/90 backdrop-blur-sm">
        <div>
          <h4
            className="text-body-sm font-semibold text-gray-100 line-clamp-1 group-hover:text-primary-300 transition-colors"
            title={game.title}
          >
            {game.title}
          </h4>

          {/* Genres */}
          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {game.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-[10px] text-gray-400 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer / CTA hint */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-body-xs text-gray-400">
          <span className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors">
            Lihat Kredensial
          </span>
          <span className="text-primary-400 font-bold group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
