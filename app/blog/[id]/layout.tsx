import type { Metadata } from "next";
import { getBlogById } from '@/lib/utils/blogData';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const post = await getBlogById(params.id);

  return {
    title: post?.title ?? "Blog Post",
    description: post?.summary ?? post?.excerpt ?? "Read this article by Karrtik Gupta.",
    alternates: { canonical: `/blog/${params.id}` },
    openGraph: {
      title: post?.title,
      description: post?.summary ?? post?.excerpt,
      type: "article",
      url: `https://www.karrtikgupta.me/blog/${params.id}`,
      images: post?.imageUrl
        ? [{ url: post.imageUrl, width: 1200, height: 630 }]
        : [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
