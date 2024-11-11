import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "DepannPC - Plateforme de Gestion",
  description: "Plateforme de gestion pour l'équipe DepannPC",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                    <TaskProvider>{children}</TaskProvider>
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
