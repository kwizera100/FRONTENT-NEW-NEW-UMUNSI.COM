import { notFound, redirect } from "next/navigation";
import { api } from "@/lib/api";

type Props = { params: { slug: string } };

export const revalidate = 60;
export const dynamicParams = true;

const RESERVED_SLUGS = [
  "admin", "api", "article", "author", "category", "contact",
  "search", "reset-password", "about", "login", "profile",
  "settings", "users", "posts", "media", "categories",
];

export default async function RootSlugPage({ params }: Props) {
  const slug = params.slug?.toLowerCase();

  // Skip reserved paths — they should be handled by their own routes
  if (RESERVED_SLUGS.includes(slug)) {
    notFound();
  }

  // Attempt to find the article by the root-level slug
  const post = await api.getPostBySlug(params.slug);

  if (post) {
    // Redirect to the canonical /article/{slug} URL
    redirect(`/article/${post.slug}`);
  }

  notFound();
}
