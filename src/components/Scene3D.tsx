import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  scale?: number;
  type?: 'sphere' | 'torus' | 'icosahedron';
}

const FloatingShape = ({ position, color, speed = 1, scale = 1, type = 'sphere' }: FloatingShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
    }
  });

  const renderShape = () => {
    switch (type) {
      case 'torus':
        return (
          <Torus args={[0.5, 0.2, 16, 32]} scale={scale}>
            <MeshWobbleMaterial
              color={color}
              factor={0.3}
              speed={speed}
              transparent
              opacity={0.7}
            />
          </Torus>
        );
      case 'icosahedron':
        return (
          <Icosahedron args={[0.5, 0]} scale={scale}>
            <MeshDistortMaterial
              color={color}
              distort={0.3}
              speed={speed * 2}
              transparent
              opacity={0.6}
            />
          </Icosahedron>
        );
      default:
        return (
          <Sphere args={[0.5, 32, 32]} scale={scale}>
            <MeshDistortMaterial
              color={color}
              distort={0.4}
              speed={speed * 1.5}
              transparent
              opacity={0.6}
            />
          </Sphere>
        );
    }
  };

  return (
    <Float
      speed={speed}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <mesh ref={meshRef} position={position}>
        {renderShape()}
      </mesh>
    </Float>
  );
};

interface ParticlesProps {
  count?: number;
  color?: string;
}

const Particles = ({ count = 100, color = '#4F46E5' }: ParticlesProps) => {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const MouseFollower = () => {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth follow
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        (state.mouse.x * viewport.width) / 2,
        0.05
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        (state.mouse.y * viewport.height) / 2,
        0.05
      );
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial
        color="#F59E0B"
        emissive="#F59E0B"
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
        wireframe
      />
    </mesh>
  );
};

interface Scene3DProps {
  variant?: 'auth' | 'dashboard';
  className?: string;
}

const Scene3D = ({ variant = 'auth', className = '' }: Scene3DProps) => {
  const shapes = useMemo(() => {
    if (variant === 'auth') {
      return [
        { position: [-3, 2, -2] as [number, number, number], color: '#4F46E5', speed: 1, scale: 1.2, type: 'sphere' as const },
        { position: [3, -1, -3] as [number, number, number], color: '#818CF8', speed: 0.8, scale: 1, type: 'torus' as const },
        { position: [-2, -2, -2] as [number, number, number], color: '#F59E0B', speed: 1.2, scale: 0.8, type: 'icosahedron' as const },
        { position: [2.5, 2.5, -4] as [number, number, number], color: '#6366F1', speed: 0.6, scale: 1.5, type: 'sphere' as const },
        { position: [0, -3, -3] as [number, number, number], color: '#A78BFA', speed: 0.9, scale: 0.7, type: 'torus' as const },
        { position: [-4, 0, -5] as [number, number, number], color: '#FBBF24', speed: 1.1, scale: 0.9, type: 'icosahedron' as const },
      ];
    }
    // Dashboard variant - more subtle
    return [
      { position: [-4, 3, -5] as [number, number, number], color: '#4F46E5', speed: 0.5, scale: 0.8, type: 'sphere' as const },
      { position: [4, -2, -6] as [number, number, number], color: '#818CF8', speed: 0.4, scale: 0.6, type: 'torus' as const },
      { position: [3, 3, -7] as [number, number, number], color: '#A78BFA', speed: 0.3, scale: 0.5, type: 'icosahedron' as const },
    ];
  }, [variant]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.4} />
        
        {/* Main directional light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          color="#ffffff"
        />
        
        {/* Accent lights */}
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#4F46E5" />
        <pointLight position={[5, 5, -5]} intensity={0.3} color="#F59E0B" />

        {/* Floating shapes */}
        {shapes.map((shape, index) => (
          <FloatingShape key={index} {...shape} />
        ))}

        {/* Particles */}
        <Particles count={variant === 'auth' ? 150 : 80} color="#4F46E5" />

        {/* Mouse follower - only on auth page */}
        {variant === 'auth' && <MouseFollower />}
      </Canvas>
    </div>
  );
};

export default Scene3D;
