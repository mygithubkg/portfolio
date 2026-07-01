import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Scalable Systems & AI Agents",
  description: "Explore live systems and projects engineered by Karrtik Gupta, featuring Next.js web applications, RAG architectures, LangChain, and advanced NLP pipelines.",
  alternates: { canonical: "/projects" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
