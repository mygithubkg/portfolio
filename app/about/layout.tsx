import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | AI & Full-Stack Engineer",
  description: "Learn about Karrtik Gupta, a System Architect and Full-Stack Developer bridging the gap between unstructured data and structured engineering with NLP and GenAI.",
  alternates: { canonical: "/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
