import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Our 1 Month Anniversary",
  description: "A special commemorative page celebrating our love",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
        {children}
      </body>
    </html>
  );
}
