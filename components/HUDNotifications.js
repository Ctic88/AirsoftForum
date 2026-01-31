'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Info, Target, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HUDNotifications() {
    const [notifications, setNotifications] = useState([]);

    // Poll for new notifications from Supabase
    // This is a simplified version; real-time would use Supabase Realtime
    useEffect(() => {
        const interval = setInterval(() => {
            // Placeholder logic to simulate HUD alerts for demo
            // In production, fetch from 'notifications' table
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed top-24 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="pointer-events-auto"
                    >
                        <div className="glass px-6 py-4 rounded-2xl border-l-4 border-accent-light shadow-2xl flex items-start gap-4 min-w-[300px] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="bg-accent/20 p-2 rounded-lg text-accent-light">
                                {n.type === 'alert' ? <AlertTriangle size={18} /> : n.type === 'intel' ? <Target size={18} /> : <Info size={18} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-light mb-1">{n.type} received</p>
                                <p className="text-sm text-foreground/80 font-medium">{n.content}</p>
                            </div>
                            <button
                                onClick={() => removeNotification(n.id)}
                                className="text-foreground/20 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
