import type { Metadata } from "next";
import "./globals.scss";
import UserContextProvider from "@/context/userContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <UserContextProvider>
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}
