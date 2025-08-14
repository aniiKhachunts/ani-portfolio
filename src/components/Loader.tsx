import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useApp } from "../app/store";

type TileRef = { el: HTMLDivElement | null };
const IMAGES = Array.from({ length: 8 }).map((_, i) => `/loader/${String(i + 1).padStart(2, "0")}.jpeg`);

const LOADER_MIN_MS = 2000;
const LOADER_MIN_MS_REDUCED = 2200;

export default function Loader() {
    const setLoaderDone = useApp((s) => s.setLoaderDone);
    const reduce = useReducedMotion();

    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<"loading" | "breathe" | "form" | "wipe" | "done">("loading");

    const grid = useMemo(
        () => [
            [0, 1, 2],
            [3, -1, 4],
            [5, 6, 7],
        ],
        []
    );

    const nameRef = useRef<HTMLDivElement>(null);
    const tileRefs = useRef<TileRef[][]>(grid.map((row) => row.map(() => ({ el: null }))));
    const aniRef = useRef<SVGGElement>(null);
    const mosaicRef = useRef<HTMLDivElement>(null);

    const [targets, setTargets] = useState<{ x: number; y: number; rot: number; scale: number }[][] | null>(null);

    useEffect(() => {
        if (phase !== "loading") return;

        const start = performance.now();
        const minMs = reduce ? LOADER_MIN_MS_REDUCED : LOADER_MIN_MS;

        let raf = 0;
        const step = (t: number) => {
            const elapsed = t - start;
            const pct = Math.min(1, elapsed / minMs);
            const eased = 1 - Math.pow(1 - pct, 2.2);
            const wobble = (Math.sin(t / 320) + Math.sin(t / 530)) * 1.2;
            const value = Math.min(100, Math.max(0, Math.floor(eased * 100 + wobble)));

            setProgress(value);
            if (elapsed < minMs) {
                raf = requestAnimationFrame(step);
            } else {
                setProgress(100);
            }
        };

        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [phase, reduce]);

    useEffect(() => {
        if (phase !== "loading" || progress < 100) return;

        if (reduce) {
            setPhase("wipe");
            const t = setTimeout(() => setLoaderDone(true), 300);
            return () => clearTimeout(t);
        }

        const startFormation = () => {
            const container = mosaicRef.current!;
            const cRect = container.getBoundingClientRect();
            const cx = cRect.left + cRect.width / 2;
            const cy = cRect.top + cRect.height / 2;

            const burstTargets = grid.map((row, r) =>
                row.map((idx, c) => {
                    if (idx === -1) return { x: 0, y: 0, rot: 0, scale: 1 };
                    const el = tileRefs.current[r][c].el!;
                    const tRect = el.getBoundingClientRect();
                    const tx = tRect.left + tRect.width / 2;
                    const ty = tRect.top + tRect.height / 2;
                    const vx = tx - cx;
                    const vy = ty - cy;
                    const len = Math.hypot(vx, vy) || 1;
                    const k = 22;
                    return {
                        x: (vx / len) * k,
                        y: (vy / len) * k,
                        rot: (Math.random() - 0.5) * 6,
                        scale: 1.04,
                    };
                })
            );

            setTargets(burstTargets);
            setPhase("breathe");

            setTimeout(() => {
                const g = aniRef.current!;
                const pts = samplePointsOnGroup(g, 8); // 8 tiles
                console.log("[loader] sampled points:", pts.length, pts);
                const formationTargets = grid.map((row, r) =>
                    row.map((idx, c) => {
                        if (idx === -1) return { x: 0, y: 0, rot: 0, scale: 1 };
                        const el = tileRefs.current[r][c].el!;
                        const tRect = el.getBoundingClientRect();
                        const tx = tRect.left + tRect.width / 2;
                        const ty = tRect.top + tRect.height / 2;
                        const target = pts.shift()!;
                        return {
                            x: target.x - tx,
                            y: target.y - ty,
                            rot: (Math.random() - 0.5) * 12,
                            scale: 0.52,
                        };
                    })
                );

                setTargets(formationTargets);
                setPhase("form");

                const t1 = setTimeout(() => setPhase("wipe"), 900);
                const t2 = setTimeout(() => setLoaderDone(true), 900 + 560);
                return () => {
                    clearTimeout(t1);
                    clearTimeout(t2);
                };
            }, 220);
        };

        const raf = requestAnimationFrame(startFormation);
        return () => cancelAnimationFrame(raf);
    }, [progress, phase, reduce, grid, setLoaderDone]);

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-bg"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    aria-label="Loading"
                    role="status"
                >
                    <motion.div
                        className="absolute inset-0 bg-bg"
                        initial={{ clipPath: "inset(0 0 0 0)" }}
                        animate={{ clipPath: phase === "wipe" ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" }}
                        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
                    />

                    <div className="absolute inset-0 grid place-items-center">
                        <div
                            ref={mosaicRef}
                            className="relative w-[min(92vw,1200px)] h-[min(74vh,720px)] grid grid-cols-3 grid-rows-3 gap-3 px-4">
                            {grid.flatMap((row, r) =>
                                row.map((idx, c) => {
                                    const delay = (r * 3 + c) * 0.08;

                                    if (idx === -1) {
                                        return (
                                            <div key={`empty-${r}-${c}`}  className="relative rounded-2xl border border-zinc-800/60 bg-black/10 overflow-hidden grain">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.25, duration: 0.5 }}
                                                        className="relative"
                                                    >
                                                        <div className="absolute -inset-6 rounded-2xl bg-white/4 backdrop-blur-md border border-white/10 z-0" />
                                                        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2 md:gap-3 px-6 py-6 w-full max-w-[520px] mx-auto">
                                                            <div
                                                                ref={nameRef}
                                                                className="font-display tracking-tight text-[clamp(1.6rem,4.2vw,3rem)] leading-[1.05] whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                                                            >
                                                                ANI KHACHUNTS
                                                            </div>
                                                            <div className="mt-0">
                                                                <div className="text-zinc-300 text-[clamp(1rem,2.2vw,1.5rem)] font-medium tabular-nums tracking-tight">
                                                                    {Math.max(0, Math.min(100, Math.round(progress)))}%
                                                                </div>
                                                                <div className="text-xs md:text-sm text-zinc-500 mt-1 tracking-widest">
                                                                    {phase === "loading" ? "LOADING" : "READY"}
                                                                </div>
                                                            </div>
                                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none z-[-1]"
                                                                width="360" height="144" viewBox="0 0 360 144" aria-hidden
                                                            >
                                                                <g ref={aniRef} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M20 124 L60 20 L100 124 M36 88 L84 88" />
                                                                    <path d="M130 124 L130 20 L210 124 L210 20" />
                                                                    <path d="M250 20 L250 124" />
                                                                </g>
                                                            </svg>

                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    const img = IMAGES[idx % IMAGES.length];
                                    const target = targets?.[r]?.[c];
                                    const forming =
                                        (phase === "breathe" || phase === "form") && target
                                            ? { x: target.x, y: target.y, rotate: target.rot, scale: target.scale, zIndex: 40 }
                                            : { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 1 };

                                    return (
                                        <motion.div
                                            key={`tile-${r}-${c}`}
                                            ref={(el) => { tileRefs.current[r][c].el = el; }}
                                            className="relative rounded-xl overflow-hidden border border-zinc-800/60 bg-zinc-900/20 will-change-transform"
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } }}
                                        >
                                            <motion.div
                                                className="absolute inset-0"
                                                animate={forming}
                                                transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.7 }}
                                            >
                                                <motion.img
                                                    src={img}
                                                    alt=""
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    initial={{ scale: 1.06 }}
                                                    animate={{ scale: phase === "form" ? 1 : 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: phase === "breathe" ? 220 : 140,
                                                        damping: phase === "breathe" ? 16 : 18,
                                                        mass: 0.6,
                                                    }}
                                                    loading="eager"
                                                    decoding="async"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/30" />
                                            </motion.div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function samplePointsOnGroup(g: SVGGElement, count: number): { x: number; y: number }[] {
    const paths = Array.from(g.querySelectorAll("path"));
    if (!paths.length || count <= 0) return [];
    const lengths = paths.map(p => p.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);

    const svg = g.closest("svg") as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const sx = rect.width / vb.width;
    const sy = rect.height / vb.height;

    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
        const d = (i / Math.max(1, count - 1)) * total;
        let acc = 0, idx = 0;
        while (idx < lengths.length && acc + lengths[idx] < d) {
            acc += lengths[idx++];
        }
        const path = paths[Math.min(idx, paths.length - 1)];
        const local = path.getPointAtLength(d - acc);
        points.push({
            x: rect.left + local.x * sx,
            y: rect.top + local.y * sy,
        });
    }
    return points;
}

