import { Canvas } from "@react-three/fiber";
import { Environment, Float, Text } from "@react-three/drei";

export default function ThreeScene({ label = "{}" }: { label?: string }) {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <Environment preset="city" />
            <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
                <Text fontSize={1.4} font="/fonts/SpaceGrotesk-Variable.woff2" anchorX="center" anchorY="middle">
                    {label}
                </Text>
            </Float>
        </Canvas>
    );
}
