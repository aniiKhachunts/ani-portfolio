import { Link, useLocation } from "react-router-dom";
import { useApp } from "../app/store";

export default function TopBar() {
    const loc = useLocation();
    const toggleMenu = useApp(s => s.toggleMenu);

    return (
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-bg/70 bg-bg/90 border-b border-zinc-900">
            <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-6 md:px-10">
                <Link to="/" className="font-display tracking-wide">ANI KHACHUNTS</Link>
                <nav className="hidden md:flex gap-6 text-sm text-mute">
                    <Link to="/developer" className={loc.pathname.startsWith("/developer") ? "text-fg" : ""}>Developer</Link>
                    <Link to="/violinist"  className={loc.pathname.startsWith("/violinist") ? "text-fg" : ""}>Violinist</Link>
                    <button onClick={() => toggleMenu()} className="border border-zinc-800 rounded-md px-2 py-1">⌘K</button>
                </nav>
            </div>
        </header>
    );
}
