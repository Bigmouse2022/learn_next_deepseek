import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryClientProvider from "@/app/compoents/QueryClientProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
  return (
    <ClerkProvider>
      <QueryClientProvider>
      <html lang="en">
        <body
           className={`${geistSans.variable} ${geistMono.variable} `}
        >

            {/* <Navibar /> */}

          <div 
          // className="w-4/5 h-screen"
          >{children}</div>
        </body>
      </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
