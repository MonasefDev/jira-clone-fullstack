import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cn } from "../lib/utils";
import { QueryProvider } from "../components/TanstackProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jira Clone",
  description: "Jira clone using nextjs and tailwindcss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <NuqsAdapter>
        <QueryProvider>
          <body className={cn(inter.className, "min-h-screen antialiased")}>
            {children}
            <Toaster
              position="top-center"
              gutter={12}
              containerStyle={{ margin: "8px" }}
              toastOptions={{
                success: {
                  duration: 3000,
                },
                error: {
                  duration: 5000,
                },
                style: {
                  fontSize: "16px",
                  maxWidth: "500px",
                  padding: "16px 24px",
                  backgroundColor: "var(--color-grey-0)",
                  color: "var(--color-grey-700)",
                },
              }}
            />
          </body>
        </QueryProvider>
      </NuqsAdapter>
    </html>
  );
}
