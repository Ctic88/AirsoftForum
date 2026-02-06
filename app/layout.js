import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import AudioPlayer from "@/components/AudioPlayer";
import HUDNotifications from "@/components/HUDNotifications";
import TacticalCursor from "@/components/TacticalCursor";
import MissionClock from "@/components/MissionClock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Airsoft Forum | Elite Tactical Community",
  description: "Join the most advanced airsoft discussion platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <AudioPlayer />
          <HUDNotifications />
          <TacticalCursor />
          <MissionClock />
        </AuthProvider>
      </body>
    </html>
  );
}
