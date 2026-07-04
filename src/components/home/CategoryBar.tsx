import Link from "next/link";
import { Flame, Megaphone, Music, Trophy, Cpu, Film, HeartPulse, Briefcase, Globe, MapPin } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Flame,
  Megaphone,
  Music,
  Trophy,
  Cpu,
  Film,
  HeartPulse,
  Briefcase,
  Globe,
  MapPin,
};

interface CategoryBarCategory {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
}

export function CategoryBar({ categories = [] }: { categories?: CategoryBarCategory[] }) {
  return (
    <div className="bg-white border-y border-ink-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto scrollbar-hide pb-1">
          <span className="text-xs font-bold text-ink-400 uppercase shrink-0 hidden lg:inline">
            Ibyiciro:
          </span>
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon || ""] || Flame;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-50 hover:bg-ink-900 hover:text-white transition-all shrink-0 group"
              >
                <Icon className="w-4 h-4" style={{ color: cat.color || "#f43f5e" }} />
                <span className="text-sm font-semibold whitespace-nowrap">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
