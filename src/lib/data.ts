export interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  color: string;
  icon: string;
  description: string;
  order: number;
}

export interface PostMedia {
  id: string;
  url: string;
  type: "image" | "video" | "youtube";
  caption: string;
  alt?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured: boolean;
  published: boolean;
  views: number;
  publishedAt: string;
  createdAt: string;
  category: Category;
  author: { name: string; avatar?: string };
  media: PostMedia[];
  tags: string[];
  readTime: number;
  coverImage: string;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "inkuru-nyamukuru",
    name: "Inkuru Nyamukuru",
    nameEn: "Breaking News",
    color: "#dc2626",
    icon: "Flame",
    description: "Inkuru z'ibyibutsa mu Rwanda no ku isi",
    order: 1,
  },
  {
    id: "cat-2",
    slug: "amakuru",
    name: "Amatangazo",
    nameEn: "News & Announcements",
    color: "#2563eb",
    icon: "Megaphone",
    description: "Amatangazo y'amakuru y'ingenzi",
    order: 2,
  },
  {
    id: "cat-3",
    slug: "imyidagaduro",
    name: "Imyidagaduro",
    nameEn: "Entertainment",
    color: "#7c3aed",
    icon: "Music",
    description: "Ibyo umuryango ukunda kwidagaduraho",
    order: 3,
  },
  {
    id: "cat-4",
    slug: "imikino",
    name: "Imikino",
    nameEn: "Sports",
    color: "#059669",
    icon: "Trophy",
    description: "Imikino y'abaprofeyisoneli n'amakuru y'imikino",
    order: 4,
  },
  {
    id: "cat-5",
    slug: "ikoranabuhanga",
    name: "Ikoranabuhanga",
    nameEn: "Technology",
    color: "#0891b2",
    icon: "Cpu",
    description: "Ikoranabuhanga rishya n'ibyiza mu bijyanye na tech",
    order: 5,
  },
  {
    id: "cat-6",
    slug: "cinema",
    name: "Cinema",
    nameEn: "Cinema",
    color: "#db2777",
    icon: "Film",
    description: "Amafilime, abakinnyi, n'amakuru ya sinema",
    order: 6,
  },
  {
    id: "cat-7",
    slug: "health",
    name: "Health",
    nameEn: "Health",
    color: "#16a34a",
    icon: "HeartPulse",
    description: "Amakuru y'ubuzima n'imiti",
    order: 7,
  },
  {
    id: "cat-8",
    slug: "akazi",
    name: "Akazi",
    nameEn: "Jobs",
    color: "#ea580c",
    icon: "Briefcase",
    description: "Akazi k'umunsi, imirimo n'amahugurwa",
    order: 8,
  },
  {
    id: "cat-9",
    slug: "hanze",
    name: "Hanze",
    nameEn: "World / International",
    color: "#4f46e5",
    icon: "Globe",
    description: "Amakuru y'isi hanze y'u Rwanda",
    order: 9,
  },
  {
    id: "cat-10",
    slug: "inkuru-ku-rwanda",
    name: "Inkuru ku Rwanda",
    nameEn: "Rwanda Stories",
    color: "#0d9488",
    icon: "MapPin",
    description: "Inkuru z'umuco, amateka, n'iterambere ry'u Rwanda",
    order: 10,
  },
];

const lorem = (paras: number = 3) =>
  Array.from({ length: paras }, (_, i) =>
    `<p>U Rwanda rwagiye ritera imbere mu byinshi bitandukanye. Mu bijyanye n'ikoranabuhanga, hagize aho bigaragaramo ko hashyizweho ingamba zo guteza imbere ubukungu bw'igihugu. Abanyarwanda bakomeje kugira uruhare rukomeye mu guteza imbere ibyiza byo mu gihugu cyabo. ${i === 1 ? "Mu nzego zitandukanye, harimo amashuri makuru, ubuvuzi, n'ubuhinzi, byose bigenda bizamuka." : ""} Ibi byose bigamije gushyiraho urwego rw'iterambere rirambye ruzafasha abaturage kugira ubuzima bwiza.</p>`
  ).join("\n\n");

export const posts: Post[] = [
  {
    id: "post-1",
    slug: "rwanda-tech-innovation-hub-2025",
    title: "U Rwanda rwiyemeje kuba Afurika y'Ikarinabuhanga mu 2025",
    excerpt:
      "Leta y'u Rwanda yatangije gahunda nshya yo guteza imbere ikoranabuhanga mu gihugu hose, mu rwego rwo kuba hub nyamukuru ya Afurika.",
    content: lorem(5),
    featured: true,
    published: true,
    views: 15420,
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    category: categories[4],
    author: { name: "Mugisha Eric" },
    media: [
      {
        id: "m1",
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
        type: "image",
        caption: "Ikoranabuhanga mu Rwanda riri gukomera",
      },
      {
        id: "m2",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "youtube",
        caption: "Igitekerezo cy'ikoranabuhanga",
      },
    ],
    tags: ["ikoranabuhanga", "rwanda", "innovation"],
    readTime: 5,
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
  },
  {
    id: "post-2",
    slug: "amavubi-qualifies-africa-cup",
    title: "Amavubi yatoye ibyifuzo byo kugira uruhare mu CAN 2025",
    excerpt:
      "Ikipe y'igihugu y'u Rwanda mu mupira w'amaguru yageze ku rwego rwo kwiyemeza ibyifuzo byo gusubira mu CAN.",
    content: lorem(4),
    featured: true,
    published: true,
    views: 22100,
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    category: categories[3],
    author: { name: "Uwase Diane" },
    media: [
      {
        id: "m3",
        url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80",
        type: "image",
        caption: "Amavubi mu kibuga",
      },
    ],
    tags: ["imikino", "amavubi", "football"],
    readTime: 4,
    coverImage:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80",
  },
  {
    id: "post-3",
    slug: "rwandan-cinema-rising-stars",
    title: "Sinema nyarwanda: Abakinnyi b'ishyaka bari kwigarurira isoko",
    excerpt:
      "Abakinnyi ba sinema nyarwanda bavuga ko bakomeje kugera ku rwego rwo gukora amafilime agiye ku isi yose.",
    content: lorem(4),
    featured: true,
    published: true,
    views: 8730,
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 9 * 3600000).toISOString(),
    category: categories[5],
    author: { name: "Habimana Jean" },
    media: [
      {
        id: "m4",
        url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80",
        type: "image",
        caption: "Seti ya filime nyarwanda",
      },
    ],
    tags: ["cinema", "filime", "rwanda"],
    readTime: 6,
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80",
  },
  {
    id: "post-4",
    slug: "new-health-initiative-rural-areas",
    title: "Minisiteri y'Ubuzima yatangije gahunda nshya y'ubuvuzi mu cyaro",
    excerpt:
      "Gahunda nshya yo kugeza ubuvuzi bw'ibanze mu turere tw'icyaro yatangiye gukorwa mu ntara zose z'u Rwanda.",
    content: lorem(3),
    featured: true,
    published: true,
    views: 5400,
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 13 * 3600000).toISOString(),
    category: categories[6],
    author: { name: "Mukamana Alice" },
    media: [
      {
        id: "m5",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80",
        type: "image",
        caption: "Ivuriro mu cyaro",
      },
    ],
    tags: ["health", "ubuzima", "rwanda"],
    readTime: 3,
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80",
  },
  {
    id: "post-5",
    slug: "kigali-international-conference-2025",
    title: "Kigali yateguye inama mpuzamahanga y'ubukungu mu 2025",
    excerpt:
      "Abayobozi b'ibihugu byinshi bo muri Afurika bazaza mu nama yo gufatanaho ibyemezo by'iterambere.",
    content: lorem(4),
    featured: false,
    published: true,
    views: 3200,
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 19 * 3600000).toISOString(),
    category: categories[0],
    author: { name: "Nshimiyimana Paul" },
    media: [
      {
        id: "m6",
        url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&q=80",
        type: "image",
        caption: "Inama i Kigali",
      },
    ],
    tags: ["inkuru-nyamukuru", "kigali", "inama"],
    readTime: 4,
    coverImage:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&q=80",
  },
  {
    id: "post-6",
    slug: "rwanda-music-awards-2025",
    title: "Abahanga bumuzika nyarwanda bazahabwa ibihembo mu 2025",
    excerpt:
      "Urugendo rwa muzika nyarwanda ruzaba rwo guha ibihembo abahanga bakomeye b'umuzika.",
    content: lorem(3),
    featured: false,
    published: true,
    views: 9100,
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 3600000).toISOString(),
    category: categories[2],
    author: { name: "Iradukunda Linda" },
    media: [
      {
        id: "m7",
        url: "https://images.unsplash.com/photo-1470225620780-dba8ae36f94d?w=1600&q=80",
        type: "image",
        caption: "Umuhanga w'umuzika",
      },
    ],
    tags: ["imyidagaduro", "muzika", "awards"],
    readTime: 3,
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ae36f94d?w=1600&q=80",
  },
  {
    id: "post-7",
    slug: "job-fair-kigali-tech-companies",
    title: "Akazi kangana: Kampani z'ikoranabuhanga zari Kigali ziri gushaka abakozi",
    excerpt:
      "Igiterangabo cy'akazi cyizaba i Kigali aho kampani z'ikoranabuhanga zizaba zishaka abakozi bashya.",
    content: lorem(3),
    featured: false,
    published: true,
    views: 4500,
    publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 31 * 3600000).toISOString(),
    category: categories[7],
    author: { name: "Bizimana Eric" },
    media: [
      {
        id: "m8",
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80",
        type: "image",
        caption: "Igiterangabo cy'akazi",
      },
    ],
    tags: ["akazi", "kigali", "tech"],
    readTime: 3,
    coverImage:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80",
  },
  {
    id: "post-8",
    slug: "world-economic-outlook-2025",
    title: "Ibyifuzo by'ubukungu bw'isi mu 2025: Afurika ifite uruhare?",
    excerpt:
      "Abahanga mu by'ubukungu bavuga ko Afurika ishobora kugira uruhare runini mu iterambere ry'isi.",
    content: lorem(4),
    featured: false,
    published: true,
    views: 2800,
    publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 37 * 3600000).toISOString(),
    category: categories[8],
    author: { name: "Kalisa Patrick" },
    media: [
      {
        id: "m9",
        url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80",
        type: "image",
        caption: "Ubukungu bw'isi",
      },
    ],
    tags: ["hanze", "ubukungu", "afurika"],
    readTime: 5,
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80",
  },
  {
    id: "post-9",
    slug: "rwanda-cultural-heritage-preservation",
    title: "Kubungabunga umuco nyarwanda: Uruhare rw'urubyiruko",
    excerpt:
      "Urubyiruko nyarwanda ruri gufata uruhare mu kubungabunga no guteza imbere umuco w'Abanyarwanda.",
    content: lorem(4),
    featured: false,
    published: true,
    views: 6700,
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 49 * 3600000).toISOString(),
    category: categories[9],
    author: { name: "Mutesi Grace" },
    media: [
      {
        id: "m10",
        url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80",
        type: "image",
        caption: "Umuco nyarwanda",
      },
    ],
    tags: ["inkuru-ku-rwanda", "umuco", "urubyiruko"],
    readTime: 4,
    coverImage:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80",
  },
  {
    id: "post-10",
    slug: "startups-kigali-investment-2025",
    title: "Kigali: Hub nyamukuru ya startup mu 2025, ishoramari riyongera",
    excerpt:
      "Abashoramari bo ku isi bari gufata Kigali nk'ahantu hazamuka hub ya startup muri Afurika.",
    content: lorem(3),
    featured: false,
    published: true,
    views: 7300,
    publishedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 61 * 3600000).toISOString(),
    category: categories[4],
    author: { name: "Mugisha Eric" },
    media: [
      {
        id: "m11",
        url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80",
        type: "image",
        caption: "Startup i Kigali",
      },
    ],
    tags: ["ikoranabuhanga", "startup", "kigali"],
    readTime: 3,
    coverImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80",
  },
  {
    id: "post-11",
    slug: "basketball-rwanda-champions-league",
    title: "Pregisi y'ikipe y'ibasiketi y'u Rwanda mu marushanwa y'Afurika",
    excerpt:
      "Ikipe y'ibasiketi y'u Rwanda yageze mu cyiciro cya nyuma cy'amakipe y'Afurika.",
    content: lorem(3),
    featured: false,
    published: true,
    views: 4100,
    publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 73 * 3600000).toISOString(),
    category: categories[3],
    author: { name: "Uwase Diane" },
    media: [
      {
        id: "m12",
        url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&q=80",
        type: "image",
        caption: "Ibasiketi mu Rwanda",
      },
    ],
    tags: ["imikino", "basiketi", "afurika"],
    readTime: 3,
    coverImage:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&q=80",
  },
  {
    id: "post-12",
    slug: "mental-health-awareness-rwanda",
    title: "Ubuzima bwo mu mutwe: U Rwanda rwongereye ingamba zo gutabara",
    excerpt:
      "Minisiteri y'Ubuzima yongereye imbaraga mu guha abaturage ubuvuzi bwo mu mutwe.",
    content: lorem(3),
    featured: false,
    published: true,
    views: 3900,
    publishedAt: new Date(Date.now() - 84 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 85 * 3600000).toISOString(),
    category: categories[6],
    author: { name: "Mukamana Alice" },
    media: [
      {
        id: "m13",
        url: "https://images.unsplash.com/photo-1499209974431-9fccce49fdc4?w=1600&q=80",
        type: "image",
        caption: "Ubuzima bwo mu mutwe",
      },
    ],
    tags: ["health", "ubuzima-bwo-mu-mutwe", "rwanda"],
    readTime: 4,
    coverImage:
      "https://images.unsplash.com/photo-1499209974431-9fccce49fdc4?w=1600&q=80",
  },
];

export function getFeaturedPosts(): Post[] {
  return posts.filter((p) => p.featured && p.published);
}

export function getLatestPosts(limit?: number): Post[] {
  const sorted = [...posts]
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getPostsByCategory(slug: string): Post[] {
  return posts.filter((p) => p.published && p.category.slug === slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPopularPosts(limit: number = 5): Post[] {
  return [...posts]
    .filter((p) => p.published)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
