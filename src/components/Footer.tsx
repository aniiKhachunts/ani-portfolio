import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-zinc-900">
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid gap-6 md:grid-cols-2">
                <div>
                    <div className="font-display text-2xl">Let’s build or perform together.</div>
                    <p className="text-mute mt-2">Frontend projects, UI labs, collaborations, violin gigs & recordings.</p>
                    <a href="mailto:you@example.com" className="inline-block mt-4 border border-zinc-800 rounded-md px-3 py-2 hover:bg-white/5">Email me</a>
                </div>
                <nav className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                        <div className="text-zinc-500 uppercase tracking-wide text-xs">Explore</div>
                        <Link to="/developer" className="block text-mute hover:text-fg">Developer</Link>
                        <Link to="/violinist" className="block text-mute hover:text-fg">Violinist</Link>
                    </div>
                    <div className="space-y-2">
                        <div className="text-zinc-500 uppercase tracking-wide text-xs">Elsewhere</div>
                        <a className="block text-mute hover:text-fg" href="#" target="_blank" rel="noreferrer">GitHub</a>
                        <a className="block text-mute hover:text-fg" href="#" target="_blank" rel="noreferrer">LinkedIn</a>
                    </div>
                </nav>
            </div>
            <div className="text-xs text-zinc-500 text-center py-4">© {new Date().getFullYear()} ANI KHACHUNTS</div>
        </footer>
    );
}
