import { useParams, Link } from "react-router-dom";
import { CASE_STUDIES } from "../mock";

export default function CaseStudyPage() {
    const { slug } = useParams();
    const cs = CASE_STUDIES.find(c => c.slug === slug);
    if (!cs) return <div className="p-10">Not found.</div>;

    return (
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
            <Link to="/developer" className="text-sm text-mute border-b border-dashed border-mute">← Back to Developer</Link>
            <h1 className="font-display text-4xl mt-4">{cs.title}</h1>
            <p className="text-mute mt-2">{cs.role}</p>
            <ul className="mt-4 text-sm">{cs.impact.map(i => <li key={i}>{i}</li>)}</ul>
            <div className="prose prose-invert mt-6">{cs.body}</div>
            <div className="mt-6 text-sm text-mute">Tech: {cs.tech.join(", ")}</div>
        </div>
    );
}
