import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Initialize Collaboration",
  description: "Get in touch with Karrtik Gupta for freelance development, AI engineering collaborations, or technical consultations. Available in Chandigarh, India.",
  alternates: { canonical: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
