import { InstallPWA } from "@/components/pwa/InstallPWA";
import { PWAStatus } from "@/components/pwa/PWAStatus";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <InstallPWA />
      <PWAStatus />
    </>
  );
}
