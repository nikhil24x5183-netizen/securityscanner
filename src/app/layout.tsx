import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibesheid - AI Code Vulnerability & Error Scanner",
  description: "Upload code zip archives for instant LLM security audit and automated fixes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
