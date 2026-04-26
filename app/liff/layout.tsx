import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LINE AI Assistant",
  description: "LIFF AI Chat powered by Claude",
};

export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
