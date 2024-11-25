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
import { useEffect, useState } from "react";

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
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    registerServiceWorker();

    // const initializeAudio = async () => {
    //   try {
    //     const audioContext = new (window.AudioContext ||
    //       (window as any).webkitAudioContext)();
    //     await audioContext.resume();
    //     setAudioEnabled(true);

    //     // Précharger les sons
    //     const sounds = [
    //       "/sounds/notification.wav",
    //       "/sounds/success.wav",
    //       "/sounds/review.wav",
    //     ];

    //     sounds.forEach((sound) => {
    //       const audio = new Audio(sound);
    //       audio.load();
    //     });
    //   } catch (error) {
    //     console.log("Audio initialization failed:", error);
    //   }
    // };
    const initializeAudio = async () => {
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        await audioContext.resume();
        setAudioEnabled(true);

        const sounds = [
          "/sounds/notification.wav",
          "/sounds/success.wav",
          "/sounds/review.wav",
        ];

        sounds.forEach((sound) => {
          const audio = new Audio(sound);
          audio.volume = 1.0; // Maximum volume
          audio.muted = false; // Ensure not muted
          audio.load();
        });
      } catch (error) {
        console.log("Audio initialization failed:", error);
      }
    };

    const handleUserInteraction = () => {
      if (!audioEnabled) {
        initializeAudio();
      }
    };

    // Écouter les interactions utilisateur
    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) =>
      document.addEventListener(event, handleUserInteraction, { once: true })
    );

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleUserInteraction)
      );
    };
  }, [audioEnabled]);

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
