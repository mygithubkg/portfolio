import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogById } from '@/lib/utils/blogData';
import BlogDetailClient from './BlogDetailClient';

type Props = { params: Promise<{ id: string }> };

const BASE_URL = 'https://www.karrtikgupta.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return { title: 'Post Not Found' };
  }

  const url = `${BASE_URL}/blog/${id}`;
  const image = blog.imageUrl ?? `${BASE_URL}/og-image.png`;

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: { canonical: `/blog/${id}` },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url,
      type: 'article',
      publishedTime: blog.createdAt || blog.publishDate,
      modifiedTime: blog.updatedAt || blog.createdAt,
      authors: [blog.author || 'Karrtik Gupta'],
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: [image],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  return <BlogDetailClient blog={blog} id={id} />;
}