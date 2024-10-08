import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/themes/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neon Chat",
  description: "Message with your friends",
  authors: [{ name: "@lizardkingLK", url: "https://github.com/lizardkinglk" }],
  metadataBase: new URL("https://neonchat.vercel.app"),
  openGraph: {
    url: "/",
    siteName: "NeonChat",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <body className={robotoMono.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="h-screen w-full lg:w-1/3 md:w-1/2 md:absolute md:left-1/2 md:-translate-x-1/2">
              {<Navbar />}
              {children}
            </div>
            <div>
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
