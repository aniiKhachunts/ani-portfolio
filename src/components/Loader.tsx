import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../app/store";

export default function Loader() {
    const [progress, setProgress] = useState(0);
    const setLoaderDone = useApp(s => s.setLoaderDone);

    useEffect(() => {
        const t = setInterval(() => setProgress(p => Math.min(100, p + Math.random()*12)), 120);
        return () => clearInterval(t);
    }, []);

    useEffect(() => { if (progress >= 100) setTimeout(() => setLoaderDone(true), 400); }, [progress, setLoaderDone]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] grid place-items-center bg-bg"
                initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
                <div className="text-center">
                    <div className="font-display text-3xl tracking-wide">ANI KHACHUNTS</div>
                    <div className="mt-6 w-64 h-[2px] bg-zinc-800">
                        <motion.div className="h-[2px] bg-fg" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="mt-2 text-mute text-sm">{Math.round(progress)}%</div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
