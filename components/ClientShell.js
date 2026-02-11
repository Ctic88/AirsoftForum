'use client';

import dynamic from "next/dynamic";

const AudioPlayer = dynamic(() => import("@/components/AudioPlayer"), { ssr: false });
const TacticalCursor = dynamic(() => import("@/components/TacticalCursor"), { ssr: false });
const HUDNotifications = dynamic(() => import("@/components/HUDNotifications"), { ssr: false });

export default function ClientShell() {
    return (
        <>
            <AudioPlayer />
            <HUDNotifications />
            <TacticalCursor />
        </>
    );
}
