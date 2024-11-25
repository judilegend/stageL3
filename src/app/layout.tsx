"use client";
import localFont from "next/font/local";
import "./globals.css";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import "@/styles/loading-spinner.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { WorkPackageProvider } from "@/contexts/WorkpackageContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { SprintProvider } from "@/contexts/SprintContext";
import { Toaster } from "react-hot-toast";
import { PWATestFeatures } from "@/components/pwa/PWATestFeatures";
import { registerServiceWorker } from "@/utils/serviceWorkerRegistration";
import { useEffect } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <LoadingSpinner />
        <AuthProvider>
          <UserProvider>
            <CurrentProjectProvider>
              <ProjectProvider>
                <WorkPackageProvider>
                  <ActivityProvider>
                    <TaskProvider>
                      <Toaster position="top-right" />
                      {children}
                      <PWATestFeatures />
                    </TaskProvider>
                  </ActivityProvider>
                </WorkPackageProvider>
              </ProjectProvider>
            </CurrentProjectProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
