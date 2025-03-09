import type { Metadata } from "next";
import "./globals.scss";
import UserContextProvider from "@/context/userContext";
import WorkspaceContextProvider from "@/context/workspaceContext";
import { ToastContainer } from "react-toastify";
export const metadata: Metadata = {
  title: "Trello clone by Ace-shhh",
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
        <WorkspaceContextProvider>
        <UserContextProvider>
          {children}
          <ToastContainer position="bottom-right"/>
        </UserContextProvider>
        </WorkspaceContextProvider>
      </body>
    </html>
  );
}
