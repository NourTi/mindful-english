import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  Sphere, 
  Box, 
  Torus, 
  Icosahedron,
  OrbitControls,
  Environment,
  Stars,
  Text3D,
  Center
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

type SceneType = 'neural' | 'space' | 'cyber';

interface FloatingObjectProps {
  position: [number, number, number];
  color: string;
  type: 'sphere' | 'box' | 'torus' | 'icosahedron';
  speed?: number;
  scale?: number;
}

const FloatingObject = ({ position, color, type, speed = 1, scale = 1 }: FloatingObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
      if (hovered) {
        meshRef.current.scale.setScalar(scale * 1.2);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      }
    }
  });

  const renderShape = () => {
    const props = {
      onPointerOver: () => setHovered(true),
      onPointerOut: () => setHovered(false),
    };

    switch (type) {
      case 'box':
        return (
          <Box args={[0.6, 0.6, 0.6]} {...props}>
            <MeshDistortMaterial
              color={hovered ? '#00ffff' : color}
              distort={0.3}
              speed={speed * 2}
              transparent
              opacity={0.8}
              emissive={hovered ? '#00ffff' : color}
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </Box>
        );
      case 'torus':
        return (
          <Torus args={[0.4, 0.15, 16, 32]} {...props}>
            <MeshDistortMaterial
              color={hovered ? '#ff00ff' : color}
              distort={0.2}
              speed={speed}
              transparent
              opacity={0.7}
              emissive={hovered ? '#ff00ff' : color}
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </Torus>
        );
      case 'icosahedron':
        return (
          <Icosahedron args={[0.5, 0]} {...props}>
            <MeshDistortMaterial
              color={hovered ? '#ffff00' : color}
              distort={0.4}
              speed={speed * 1.5}
              transparent
              opacity={0.6}
              wireframe
              emissive={hovered ? '#ffff00' : color}
              emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          </Icosahedron>
        );
      default:
        return (
          <Sphere args={[0.4, 32, 32]} {...props}>
            <MeshDistortMaterial
              color={hovered ? '#00ff88' : color}
              distort={0.5}
              speed={speed * 2}
              transparent
              opacity={0.7}
              emissive={hovered ? '#00ff88' : color}
              emissiveIntensity={hovered ? 0.5 : 0.2}
            />
          </Sphere>
        );
    }
  };

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        {renderShape()}
      </mesh>
    </Float>
  );
};

// Neural Network Scene
const NeuralScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
        ] as [number, number, number],
        color: ['#4F46E5', '#818CF8', '#A78BFA', '#C4B5FD'][Math.floor(Math.random() * 4)],
        type: ['sphere', 'icosahedron'][Math.floor(Math.random() * 2)] as 'sphere' | 'icosahedron',
        speed: 0.5 + Math.random() * 0.5,
        scale: 0.3 + Math.random() * 0.4,
      });
    }
    return arr;
  }, []);

  // Neural connections
  const connections = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      if (Math.random() > 0.5) {
        const j = Math.floor(Math.random() * nodes.length);
        if (i !== j) {
          lines.push([
            new THREE.Vector3(...nodes[i].position),
            new THREE.Vector3(...nodes[j].position),
          ]);
        }
      }
    }
    return lines;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <FloatingObject key={i} {...node} />
      ))}
      {connections.map((points, i) => (
        <line key={`line-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...points[0].toArray(), ...points[1].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#4F46E5" transparent opacity={0.3} />
        </line>
      ))}
    </group>
  );
};

// Space Scene
const SpaceScene = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Main planet */}
      <Sphere ref={planetRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#1a1a2e"
          distort={0.2}
          speed={2}
          emissive="#4F46E5"
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Rings */}
      <Torus ref={ringsRef} args={[2.5, 0.1, 2, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#F59E0B" transparent opacity={0.6} />
      </Torus>
      <Torus args={[3, 0.05, 2, 100]} rotation={[Math.PI / 2.2, 0, 0]}>
        <meshStandardMaterial color="#818CF8" transparent opacity={0.4} />
      </Torus>

      {/* Moons */}
      <Float speed={2} rotationIntensity={0.3}>
        <Sphere args={[0.3, 32, 32]} position={[3.5, 1, 0]}>
          <MeshDistortMaterial color="#00ffff" distort={0.1} emissive="#00ffff" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.2}>
        <Icosahedron args={[0.2, 0]} position={[-2, 2, 1]}>
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} wireframe />
        </Icosahedron>
      </Float>
    </group>
  );
};

// Cyber City Scene
const CyberScene = () => {
  const cityRef = useRef<THREE.Group>(null);

  const buildings = useMemo(() => {
    const arr = [];
    for (let x = -4; x <= 4; x += 1.5) {
      for (let z = -3; z <= 1; z += 1.5) {
        const height = 0.5 + Math.random() * 2;
        arr.push({
          position: [x, height / 2 - 1, z] as [number, number, number],
          height,
          color: ['#4F46E5', '#818CF8', '#1a1a2e'][Math.floor(Math.random() * 3)],
        });
      }
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (cityRef.current) {
      cityRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={cityRef}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshStandardMaterial color="#0a0a14" wireframe />
      </mesh>

      {/* Buildings */}
      {buildings.map((building, i) => (
        <group key={i} position={building.position}>
          <Box args={[0.8, building.height, 0.8]}>
            <meshStandardMaterial
              color={building.color}
              emissive={building.color}
              emissiveIntensity={0.2}
              transparent
              opacity={0.9}
            />
          </Box>
          {/* Window lights */}
          {Array.from({ length: Math.floor(building.height * 3) }).map((_, j) => (
            <pointLight
              key={j}
              position={[0.5, -building.height / 2 + j * 0.3 + 0.2, 0]}
              color={Math.random() > 0.5 ? '#00ffff' : '#ff00ff'}
              intensity={0.1}
              distance={0.5}
            />
          ))}
        </group>
      ))}

      {/* Floating data streams */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Float key={i} speed={2 + Math.random()} floatIntensity={2}>
          <Box
            args={[0.05, 0.3 + Math.random() * 0.5, 0.05]}
            position={[(Math.random() - 0.5) * 8, Math.random() * 3, (Math.random() - 0.5) * 6]}
          >
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </Box>
        </Float>
      ))}
    </group>
  );
};

interface SceneContentProps {
  scene: SceneType;
}

const SceneContent = ({ scene }: SceneContentProps) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4F46E5" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#F59E0B" />

      {scene === 'neural' && <NeuralScene />}
      {scene === 'space' && <SpaceScene />}
      {scene === 'cyber' && <CyberScene />}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

interface VRScenePreviewProps {
  className?: string;
}

const VRScenePreview = ({ className = '' }: VRScenePreviewProps) => {
  const [activeScene, setActiveScene] = useState<SceneType>('neural');

  const scenes: { id: SceneType; label: string; icon: string }[] = [
    { id: 'neural', label: 'Neural Network', icon: '🧠' },
    { id: 'space', label: 'Deep Space', icon: '🌌' },
    { id: 'cyber', label: 'Cyber City', icon: '🏙️' },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Scene selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {scenes.map((scene) => (
          <motion.button
            key={scene.id}
            onClick={() => setActiveScene(scene.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeScene === scene.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-background/50 backdrop-blur-sm border border-border hover:bg-accent'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{scene.icon}</span>
            {scene.label}
          </motion.button>
        ))}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <p className="text-xs text-muted-foreground bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
          🖱️ Drag to rotate • Scroll to zoom • Click objects to interact
        </p>
      </motion.div>

      {/* 3D Canvas */}
      <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-border bg-gradient-to-b from-background to-background/50">
        <Canvas
          camera={{ position: [0, 2, 6], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <SceneContent scene={activeScene} />
          </Suspense>
        </Canvas>

        {/* Overlay effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent" />
        </div>
      </div>

      {/* Scene info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScene}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-20 left-4 z-10"
        >
          <div className="bg-background/80 backdrop-blur-md border border-border rounded-lg p-3 max-w-[200px]">
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {scenes.find(s => s.id === activeScene)?.label}
            </h4>
            <p className="text-xs text-muted-foreground">
              {activeScene === 'neural' && 'Explore an AI neural network with interconnected nodes'}
              {activeScene === 'space' && 'Journey through a cosmic learning environment'}
              {activeScene === 'cyber' && 'Navigate a futuristic digital cityscape'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VRScenePreview;
