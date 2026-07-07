import type { Metadata } from 'next';
import { getBlogs } from '@/lib/utils/blogData';
import BlogListClient from './BlogListClient';
export const revalidate = 60;
export const metadata: Metadata = {
  title: 'Dev Journal & Technical Blog',
  description: 'Read Karrtik Gupta\'s Dev Journal for technical insights, architectural teardowns, and engineering philosophies on Next.js, React, Applied NLP, and AI integrations.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const blogs = await getBlogs();
  return <BlogListClient initialBlogs={blogs ?? []} />;
}