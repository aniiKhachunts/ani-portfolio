import { Link } from "react-router-dom";
import { CASE_STUDIES } from "../mock";
import ThreeScene from "./ThreeScene";

export default function DeveloperHub() {
    return (
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid md:grid-cols-[1.2fr,1fr] gap-10">
            <section>
                <h2 className="font-display text-4xl">Developer</h2>
                <p className="text-mute mt-2">Case studies, UI experiments, and open source.</p>
                <div className="mt-8 grid gap-4">
                    {CASE_STUDIES.map(c => (
                        <Link key={c.slug} to={`/developer/case/${c.slug}`} className="block border border-zinc-800 rounded-lg p-4 hover:bg-white/5">
                            <div className="font-medium">{c.title}</div>
                            <div className="text-sm text-mute">{c.role}</div>
                        </Link>
                    ))}
                </div>
            </section>
            <aside className="h-[380px] rounded-xl border border-zinc-800 overflow-hidden">
                <ThreeScene label="{}" />
            </aside>
        </div>
    );
}
