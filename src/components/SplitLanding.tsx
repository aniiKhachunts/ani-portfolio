import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "../app/store";
import { PROFILE } from "../mock";

export default function SplitLanding() {
    const nav = useNavigate();
    const setWorld = useApp(s => s.setWorld);

    const Card = ({ side, title, to }: { side:"dev"|"music"; title:string; to:string }) => (
        <button
            onClick={() => { setWorld(side === "dev" ? "developer" : "violinist"); nav(to); }}
            className="group relative isolate overflow-hidden rounded-xl border border-zinc-800 p-8 w-full h-[38vh] md:h-[58vh] text-left"
        >
            <motion.div
                initial={{ scale: 1 }} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 120 }}
                className="absolute inset-0"
            />
            <div className="relative z-10">
                <div className="text-sm text-mute">Explore</div>
                <div className="font-display text-4xl md:text-6xl mt-2">{title}</div>
                <div className="mt-3 text-mute max-w-md">Discover my work as a {title.toLowerCase()} — case studies, highlights, and process.</div>
                <div className="mt-6 inline-block text-sm tracking-wide border-b border-dashed border-mute">Enter →</div>
            </div>
            {/* subtle gradient glow */}
            <div className={`absolute -inset-24 opacity-20 blur-2xl ${side==="dev" ? "bg-accent" : "bg-emerald-500"}`} />
        </button>
    );

    return (
        <div className="px-6 md:px-10 max-w-6xl mx-auto py-16">
            <div className="text-mute text-sm mb-2">Portfolio of</div>
            <h1 className="font-display text-5xl md:text-7xl">{PROFILE.name}</h1>
            <p className="mt-4 text-lg text-zinc-400">Developer × Violinist — choose a path.</p>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Card side="dev" title="Developer" to="/developer" />
                <Card side="music" title="Violinist" to="/violinist" />
            </div>
        </div>
    );
}
