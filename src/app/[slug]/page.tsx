import { notFound, redirect } from "next/navigation";
import { api, mapApiPost } from "@/lib/api";

type Props = { params: { slug: string } };

export const revalidate = 300;

export default async function RootSlugPage({ params }: Props) {
  // Attempt to find the article by the root-level slug
  const post = await api.getPostBySlug(params.slug);

  if (post) {
    // Redirect to the canonical /article/{slug} URL
    redirect(`/article/${post.slug}`);
  }

  notFound();
}
