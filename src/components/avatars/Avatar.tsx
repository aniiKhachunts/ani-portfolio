import { motion } from "framer-motion";
import devPng from "../../assets/avatars/ani-developer.png";
import vioPng from "../../assets/avatars/ani-violinist.png";

type Props = { variant: "violin" | "dev"; size?: number };

export default function Avatar({ variant, size = 160 }: Props) {
    const src = variant === "dev" ? devPng : vioPng;
    return (
        <motion.div style={{ width: size, height: size }}
                    className="relative aspect-square rounded-full bg-[#0f0f14] ring-1 ring-zinc-800 overflow-hidden grid place-items-center p-3 md:p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <motion.img
                src={src}
                alt={variant === "dev" ? "Ani with laptop" : "Ani with violin"}
                draggable={false}
                className="pointer-events-none w-full h-full object-contain"
                style={{ objectPosition: variant === "dev" ? "50% 38%" : "50% 46%" }}
                initial={{ y: 0 }}
                animate={{ y: [0, -1.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    );
}
