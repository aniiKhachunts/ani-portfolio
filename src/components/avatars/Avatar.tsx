import { motion } from "framer-motion";
import devPng from "../../assets/avatars/ani-developer.png";
import vioPng from "../../assets/avatars/ani-violinist.png";

type Props = { variant: "violin" | "dev"; size?: number };

export default function Avatar({ variant, size = 160 }: Props) {
    const src = variant === "dev" ? devPng : vioPng;
    return (
        <motion.div
            style={{ width: size, height: size }}
            className="relative rounded-full bg-[#0f0f14] ring-1 ring-zinc-800 overflow-hidden grid place-items-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
            <motion.img
                src={src}
                alt={variant === "dev" ? "Ani with laptop" : "Ani with violin"}
                draggable={false}
                className="pointer-events-none max-w-[92%] max-h-[92%] object-contain"
                initial={{ y: 0 }}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
        </motion.div>
    );
}
