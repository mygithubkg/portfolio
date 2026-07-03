import type { Metadata } from "next";
import { getBlogById } from '@/lib/utils/blogData';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogById(resolvedParams.id);

  return {
    title: post?.title ?? "Blog Post",
    description: post?.summary ?? post?.excerpt ?? "Read this article by Karrtik Gupta.",
    alternates: { canonical: `/blog/${resolvedParams.id}` },
    openGraph: {
      title: post?.title,
      description: post?.summary ?? post?.excerpt,
      type: "article",
      url: `https://www.karrtikgupta.com/blog/${resolvedParams.id}`,
      images: post?.imageUrl
        ? [{ url: post.imageUrl, width: 1200, height: 630 }]
        : [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
