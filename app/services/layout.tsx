import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Expertise & Services",
  description: "Hire Karrtik Gupta for Full-Stack Web Development, GenAI integrations, machine learning applications, and scalable backend architecture using Node.js and PostgreSQL.",
  alternates: { canonical: "/services" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
