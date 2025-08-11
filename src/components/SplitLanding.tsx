import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "../app/store";
import { PROFILE } from "../mock";
import { useRef, useState } from "react";
import Avatar from "./avatars/Avatar";

function TiltCard({
                      side,
                      title,
                      to,
                      onClick,
                  }: {
    side: "dev" | "music";
    title: string;
    to: string;
    onClick: () => void;
}) {
    const nav = useNavigate();
    const ref = useRef<HTMLButtonElement>(null);

    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const tx = useSpring(rx, { stiffness: 140, damping: 16, mass: 0.6 });
    const ty = useSpring(ry, { stiffness: 140, damping: 16, mass: 0.6 });

    const rotX = useTransform(ty, [-0.5, 0.5], [8, -8]);
    const rotY = useTransform(tx, [-0.5, 0.5], [-8, 8]);
    const lift = useTransform(ty, [-0.5, 0.5], [6, 0]);

    const hoverBorder = side === "dev" ? "shadow-[0_0_0_1px_rgba(124,58,237,0.35)]" : "shadow-[0_0_0_1px_rgba(16,185,129,0.35)]";
    const glow = side === "dev" ? "from-accent/45 to-accent/10" : "from-emerald-500/45 to-emerald-500/10";

    const onMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;  // 0..1
        const py = (e.clientY - r.top) / r.height; // 0..1
        rx.set(px - 0.5);
        ry.set(py - 0.5);
        el.style.setProperty("--px", `${px * 100}%`);
        el.style.setProperty("--py", `${py * 100}%`);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={() => {
                rx.set(0);
                ry.set(0);
            }}
            onClick={() => {
                onClick();
                nav(to);
            }}
            style={{ rotateX: rotX as any, rotateY: rotY as any, translateZ: lift as any }}
            className={`
        group relative isolate overflow-hidden rounded-2xl border border-zinc-800
        card-spotlight p-8 md:p-10 h-[38vh] md:h-[64vh] text-left will-change-transform
        transition-shadow duration-300
        hover:${hoverBorder}
      `}
        >
            <div
                className={`pointer-events-none absolute -inset-24 opacity-30 blur-3xl bg-gradient-to-br ${glow}
        transition-opacity duration-300 group-hover:opacity-60`}
            />

            <span className="pointer-events-none absolute inset-0 rounded-2xl">
        <span
            className="absolute inset-0 rounded-2xl border border-zinc-700/0"
            style={{
                maskImage:
                    "radial-gradient(80% 80% at var(--px,50%) var(--py,50%), #000 0%, transparent 60%)",
                transition: "mask-position 120ms linear",
            }}
        />
      </span>

            <div
                className="pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(70%_70%_at_30%_30%,#000,transparent)]">
                <div
                    className="absolute inset-0 [background:repeating-linear-gradient(to_right,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_1px,transparent_1px,transparent_24px),repeating-linear-gradient(to_bottom,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_1px,transparent_1px,transparent_24px)]"/>
            </div>

            <div className="relative z-10">
                <div className="text-[11px] uppercase tracking-[0.22em] text-mute">Explore</div>
                <div className="font-display text-4xl md:text-6xl mt-2">{title}</div>
                <div className="mt-3 text-mute max-w-md">
                    Discover my work as a {title.toLowerCase()} — case studies, highlights, and process.
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm tracking-wide">
                    <span className="border-b border-dashed border-mute">Enter</span>
                    <span className="opacity-70">→</span>
                </div>
            </div>
        </motion.button>
    );
}

export default function SplitLanding() {
    const nav = useNavigate();
    const setWorld = useApp(s => s.setWorld);

    const devRef = useRef<HTMLDivElement>(null);
    const musRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<null | "violin" | "dev">(null);
    const [over, setOver] = useState<null | "violin" | "dev">(null);

    function isOverlap(a: DOMRect, b: DOMRect) {
        return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    }

    function handleDrop(kind: "violin" | "dev") {
        if (kind === "violin") {
            setWorld("violinist");
            nav("/violinist");
        } else {
            setWorld("developer");
            nav("/developer");
        }
    }

    return (
        <div
            className="px-6 md:px-10 max-w-6xl mx-auto min-h-[calc(100svh-56px)] flex flex-col justify-center gap-12 py-12 overflow-clip relative">
            <div
                aria-hidden
                className="pointer-events-none absolute -z-0 inset-0 opacity-60"
                style={{
                    background:
                        "radial-gradient(900px 460px at 10% 30%, rgba(124,58,237,.10), transparent 60%), radial-gradient(800px 420px at 80% 80%, rgba(16,185,129,.10), transparent 60%)",
                    maskImage: "radial-gradient(70% 70% at 50% 40%, #000 60%, transparent 100%)",
                }}
            />

            <div className="grain relative z-10">
                <div className="text-mute text-xs mb-1 uppercase tracking-[0.24em]">Portfolio of</div>
                <h1 className="font-display text-5xl md:text-7xl leading-tight">{PROFILE.name}</h1>
                <p className="mt-4 text-lg text-zinc-400">Developer × Violinist — choose a path.</p>
            </div>

            <div className="z-20 flex items-center justify-center gap-10 h-40 md:h-48">
                <motion.div
                    drag
                    dragMomentum={false}
                    whileTap={{ scale: 0.96 }}
                    onDragStart={() => setDragging("dev")}
                    onDrag={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const d = devRef.current?.getBoundingClientRect();
                        const m = musRef.current?.getBoundingClientRect();
                        if (d && !(rect.right < d.left || rect.left > d.right || rect.bottom < d.top || rect.top > d.bottom)) setOver("dev");
                        else if (m && !(rect.right < m.left || rect.left > m.right || rect.bottom < m.top || rect.top > m.bottom)) setOver("violin");
                        else setOver(null);
                    }}
                    onDragEnd={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const d = devRef.current?.getBoundingClientRect();
                        const m = musRef.current?.getBoundingClientRect();
                        setDragging(null);
                        if (d && !(rect.right < d.left || rect.left > d.right || rect.bottom < d.top || rect.top > d.bottom)) handleDrop("dev");
                        else if (m && !(rect.right < m.left || rect.left > m.right || rect.bottom < m.top || rect.top > m.bottom)) handleDrop("violin");
                        else setOver(null);
                    }}
                    className="cursor-grab active:cursor-grabbing"
                >
                    <Avatar variant="dev" size={120} />
                </motion.div>

                <motion.div
                    drag
                    dragMomentum={false}
                    whileTap={{ scale: 0.96 }}
                    onDragStart={() => setDragging("violin")}
                    onDrag={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const d = devRef.current?.getBoundingClientRect();
                        const m = musRef.current?.getBoundingClientRect();
                        if (m && !(rect.right < m.left || rect.left > m.right || rect.bottom < m.top || rect.top > m.bottom)) setOver("violin");
                        else if (d && !(rect.right < d.left || rect.left > d.right || rect.bottom < d.top || rect.top > d.bottom)) setOver("dev");
                        else setOver(null);
                    }}
                    onDragEnd={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const d = devRef.current?.getBoundingClientRect();
                        const m = musRef.current?.getBoundingClientRect();
                        setDragging(null);
                        if (m && !(rect.right < m.left || rect.left > m.right || rect.bottom < m.top || rect.top > m.bottom)) handleDrop("violin");
                        else if (d && !(rect.right < d.left || rect.left > d.right || rect.bottom < d.top || rect.top > d.bottom)) handleDrop("dev");
                        else setOver(null);
                    }}
                    className="cursor-grab active:cursor-grabbing"
                >
                    <Avatar variant="violin" size={120} />
                </motion.div>
            </div>

            <div className="text-center text-xs text-zinc-500 z-20">Drag a doll onto a card</div>

            <div className="grid md:grid-cols-2 gap-6 z-10">
                <div ref={devRef} className={over === "dev" ? "ring-2 ring-accent/70 rounded-2xl" : ""}>
                    <TiltCard side="dev" title="Developer" to="/developer" onClick={() => setWorld("developer")} />
                </div>
                <div ref={musRef} className={over === "violin" ? "ring-2 ring-emerald-400/70 rounded-2xl" : ""}>
                    <TiltCard side="music" title="Violinist" to="/violinist" onClick={() => setWorld("violinist")} />
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500 z-10">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-3.5 rounded-full border border-zinc-700 relative overflow-hidden">
                        <span
                            className="absolute left-1/2 -translate-x-1/2 top-1 h-1 w-1 rounded-full bg-zinc-400 animate-[scrollDot_1.8s_ease-in-out_infinite]"/>
                    </div>
                    <span>Scroll for more</span>
                </div>
            </div>
        </div>
    );
}
