import { Canvas } from "@react-three/fiber";
import { Environment, Float, MeshPortalMaterial, Text, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export default function ThreeScene({ label = "{}" }: { label?: string }) {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true }}>
            <color attach="background" args={["#0f0f14"]} />
            <ambientLight intensity={0.6} />
            <Environment preset="city" />

            <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9}>
                <mesh>
                    <torusGeometry args={[1.6, 0.06, 32, 96]} />
                    <meshStandardMaterial color="#7c3aed" metalness={0.6} roughness={0.2} />
                </mesh>

                <mesh>
                    <sphereGeometry args={[1.2, 64, 64]} />
                    <MeshPortalMaterial side={THREE.DoubleSide} resolution={0} blur={0}>
                        <color attach="background" args={["#0a0a0d"]} />
                        <Sparkles count={40} scale={3} size={3} speed={0.2} />
                        <ambientLight intensity={0.4} />
                    </MeshPortalMaterial>
                </mesh>

                <Text fontSize={0.9} font="/fonts/SpaceGrotesk-Variable.woff2" anchorX="center" anchorY="middle" position={[0, 0, 1.5]}>
                    {label}
                </Text>
            </Float>

            <EffectComposer multisampling={0}>
                <Bloom intensity={0.7} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            </EffectComposer>
        </Canvas>
    );
}
