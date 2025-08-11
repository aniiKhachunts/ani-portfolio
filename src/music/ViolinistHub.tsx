import { Link } from "react-router-dom";
import { PERFORMANCES } from "../mock";
import ThreeScene from "../dev/ThreeScene";

export default function ViolinistHub() {
    return (
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid md:grid-cols-[1.2fr,1fr] gap-10">
            <section>
                <h2 className="font-display text-4xl">Violinist</h2>
                <p className="text-mute mt-2">Performances, recordings, and collaborations.</p>
                <div className="mt-8 grid gap-4">
                    {PERFORMANCES.map(p => (
                        <Link key={p.id} to={`/violinist/performance/${p.id}`} className="block border border-zinc-800 rounded-lg p-4 hover:bg-white/5">
                            <div className="font-medium">{p.title}</div>
                            <div className="text-sm text-mute">{p.desc}</div>
                        </Link>
                    ))}
                </div>
            </section>
            <aside className="h-[380px] rounded-xl border border-zinc-800 overflow-hidden">
                <ThreeScene label="🎻" />
            </aside>
        </div>
    );
}
