import { useParams, Link } from "react-router-dom";

export default function PerformancePage() {
    const { id } = useParams();
    const yt = `https://www.youtube.com/embed/${id}?rel=0`;

    return (
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
            <Link to="/violinist" className="text-sm text-mute border-b border-dashed border-mute">← Back to Violinist</Link>
            <h1 className="font-display text-4xl mt-4">Performance</h1>
            <div className="mt-6 aspect-video">
                <iframe className="w-full h-full rounded-lg border border-zinc-800" src={yt} title="YouTube video" allowFullScreen />
            </div>
        </div>
    );
}
