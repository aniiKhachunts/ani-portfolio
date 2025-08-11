import { useEffect, useRef } from "react";

export default function PointerSpotlight() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current!;
        const onMove = (e: MouseEvent) => {
            const x = `${e.clientX}px`;
            const y = `${e.clientY}px`;
            el.style.setProperty("--x", x);
            el.style.setProperty("--y", y);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, []);
    return <div ref={ref} className="spotlight" aria-hidden="true" />;
}
