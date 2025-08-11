import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../app/store";
import { CASE_STUDIES, PERFORMANCES } from "../mock";

type Item = { label: string; to: string; section: string; hotkey?: string };

const BASE: Item[] = [
    { label: "Home", to: "/", section: "General", hotkey: "G H" },
    { label: "Developer Hub", to: "/developer", section: "General", hotkey: "G D" },
    { label: "Violinist Hub", to: "/violinist", section: "General", hotkey: "G V" },
];

export default function CommandMenu() {
    const { menuOpen, toggleMenu } = useApp();
    const nav = useNavigate();
    const [q, setQ] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const items = useMemo<Item[]>(() => {
        const dev = CASE_STUDIES.map(c => ({ label: `Case: ${c.title}`, to: `/developer/case/${c.slug}`, section: "Developer" }));
        const mus = PERFORMANCES.map(p => ({ label: `Performance: ${p.title}`, to: `/violinist/performance/${p.id}`, section: "Violinist" }));
        return [...BASE, ...dev, ...mus];
    }, []);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return items;
        return items.filter(it => it.label.toLowerCase().includes(needle) || it.section.toLowerCase().includes(needle));
    }, [q, items]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); toggleMenu(); }
            if (e.key === "Escape") { if (menuOpen) toggleMenu(); }
            if (!menuOpen) return;
            const focusables = listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-item]");
            if (!focusables?.length) return;
            const current = document.activeElement as HTMLElement | null;
            const i = Array.from(focusables).indexOf(current as HTMLButtonElement);
            if (e.key === "ArrowDown") { e.preventDefault(); focusables[Math.min(i + 1, focusables.length - 1)].focus(); }
            if (e.key === "ArrowUp") { e.preventDefault(); focusables[Math.max(i - 1, 0)].focus(); }
            if (e.key === "Enter" && current?.dataset.item) { (current as HTMLButtonElement).click(); }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen, toggleMenu]);

    useEffect(() => { if (menuOpen) setTimeout(() => inputRef.current?.focus(), 0); }, [menuOpen]);

    if (!menuOpen) return null;

    const sections = Array.from(new Set(filtered.map(f => f.section)));

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center" role="dialog" aria-modal="true" aria-label="Command menu">
            <div className="w-[min(760px,92vw)] rounded-2xl border border-zinc-800 bg-[#0f0f14] p-3 shadow-2xl">
                <div className="flex items-center gap-2 px-2">
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full bg-transparent outline-none px-3 py-3 text-lg"
                        placeholder="Type to jump… (Esc to close)"
                        aria-label="Search commands"
                    />
                    <kbd className="text-xs text-mute border border-zinc-700 rounded px-1.5 py-0.5">⌘K</kbd>
                </div>
                <div ref={listRef} className="mt-2 max-h-[56vh] overflow-auto divide-y divide-zinc-800">
                    {sections.map(sec => (
                        <div key={sec} className="py-1">
                            <div className="text-xs text-zinc-500 tracking-wide uppercase px-3 py-1">{sec}</div>
                            {filtered.filter(f => f.section === sec).map((it) => (
                                <button
                                    key={it.to}
                                    data-item=""
                                    className="w-full text-left px-3 py-3 hover:bg-white/5 flex items-center justify-between"
                                    onClick={() => { nav(it.to); toggleMenu(); }}
                                >
                                    <span>{it.label}</span>
                                    {it.hotkey && <span className="text-xs text-zinc-500">{it.hotkey}</span>}
                                </button>
                            ))}
                        </div>
                    ))}
                    {filtered.length === 0 && <div className="px-3 py-6 text-mute">No results.</div>}
                </div>
                <div className="text-xs text-mute px-3 py-2">Tip: Use ↑ ↓ and Enter to navigate.</div>
            </div>
        </div>
    );
}
