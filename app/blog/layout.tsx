import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Journal & Technical Blog",
  description: "Read Karrtik Gupta's Dev Journal for technical insights, architectural teardowns, and engineering philosophies on Next.js, React, Applied NLP, and AI integrations.",
  alternates: { canonical: "/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
