import Link from "next/link";

interface CategoryBarCategory {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
}

// Order categories starting from "inkuru-nyamukuru", then the rest in their original order.
const ORDERED_SLUGS = [
  "inkuru-nyamukuru",
  "imikino",
  "imyidagaduro",
  "ikoranabuhanga",
  "ubuzima",
  "amatangazo",
  "amakuru",
];

export function CategoryBar({ categories = [] }: { categories?: CategoryBarCategory[] }) {
  const ordered = [
    ...ORDERED_SLUGS.map((slug) =>
      categories.find((c) => c.slug.toLowerCase() === slug)
    ).filter((c): c is CategoryBarCategory => c !== undefined),
    ...categories.filter(
      (c) => !ORDERED_SLUGS.includes(c.slug.toLowerCase())
    ),
  ];

  return (
    <div className="bg-white border-y border-ink-100 py-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto scrollbar-hide pb-1">
          <span className="text-xs font-bold text-ink-400 uppercase shrink-0 hidden lg:inline">
            Ibyiciro:
          </span>
          {ordered.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="px-4 py-2 rounded-xl bg-ink-50 hover:bg-ink-900 hover:text-white transition-all shrink-0"
            >
              <span className="text-sm font-semibold whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
