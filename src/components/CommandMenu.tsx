import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../app/store";

const items = [
    { label: "Home", to: "/" },
    { label: "Developer Hub", to: "/developer" },
    { label: "Violinist Hub", to: "/violinist" },
];

export default function CommandMenu() {
    const { menuOpen, toggleMenu } = useApp();
    const nav = useNavigate();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); toggleMenu(); }
            if (e.key === "Escape") { if (menuOpen) toggleMenu(); }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen, toggleMenu]);

    if (!menuOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center">
            <div className="w-[min(680px,92vw)] rounded-xl border border-zinc-800 bg-[#0f0f14] p-3 shadow-xl">
                <input
                    autoFocus
                    className="w-full bg-transparent outline-none px-3 py-3 text-lg"
                    placeholder="Type to jump…  (Press Esc to close)"
                />
                <div className="mt-2 divide-y divide-zinc-800">
                    {items.map(it => (
                        <button
                            key={it.to}
                            className="w-full text-left px-3 py-3 hover:bg-white/5"
                            onClick={() => { nav(it.to); toggleMenu(); }}
                        >
                            {it.label}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-mute px-3 py-2">Tip: Press ⌘K / Ctrl+K anywhere.</div>
            </div>
        </div>
    );
}
