import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Environment, Html } from "@react-three/drei";
import { getLessonById } from "@/lib/seeLearningSystem";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface VRStageProps {
  lessonId: string;
  onClose: () => void;
}

// Airport Environment Scene
function AirportScene({ moduleTitle, moduleContent }: { moduleTitle: string; moduleContent: string }) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2a2a35" />
      </mesh>

      {/* Corridor walls */}
      <mesh position={[-5, 2, 0]}>
        <boxGeometry args={[0.3, 6, 20]} />
        <meshStandardMaterial color="#1a1a24" />
      </mesh>
      <mesh position={[5, 2, 0]}>
        <boxGeometry args={[0.3, 6, 20]} />
        <meshStandardMaterial color="#1a1a24" />
      </mesh>

      {/* Gate sign */}
      <group position={[0, 4, -8]}>
        <mesh>
          <boxGeometry args={[4, 1.5, 0.2]} />
          <meshStandardMaterial color="#0066cc" emissive="#0044aa" emissiveIntensity={0.5} />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          GATE A12
        </Text>
      </group>

      {/* Avatar placeholders */}
      <group position={[-2, 0, 2]}>
        <mesh position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.4, 1, 8, 16]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#718096" />
        </mesh>
      </group>

      <group position={[2, 0, 3]}>
        <mesh position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.4, 1, 8, 16]} />
          <meshStandardMaterial color="#553c9a" />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#805ad5" />
        </mesh>
      </group>

      {/* Floating info panel */}
      <Html position={[0, 3, 0]} center>
        <div className="bg-background/90 backdrop-blur-md rounded-lg p-4 border border-primary/30 shadow-xl max-w-xs text-center">
          <h3 className="text-primary font-semibold mb-2">{moduleTitle}</h3>
          <p className="text-muted-foreground text-sm">{moduleContent}</p>
        </div>
      </Html>
    </group>
  );
}

// Apartment Environment Scene
function ApartmentScene({ moduleTitle, moduleContent }: { moduleTitle: string; moduleContent: string }) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#3d3228" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -5]}>
        <boxGeometry args={[15, 6, 0.2]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      <mesh position={[-7, 2, 0]}>
        <boxGeometry args={[0.2, 6, 15]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>

      {/* Table */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[2, 0.1, 1.2]} />
          <meshStandardMaterial color="#8b5a2b" />
        </mesh>
        {/* Table legs */}
        {[[-0.9, 0, -0.5], [0.9, 0, -0.5], [-0.9, 0, 0.5], [0.9, 0, 0.5]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0, pos[2]]}>
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial color="#5c3a21" />
          </mesh>
        ))}
      </group>

      {/* Chairs */}
      <group position={[-1.5, 0, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
        <mesh position={[0, 0.5, -0.22]}>
          <boxGeometry args={[0.5, 0.6, 0.08]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
      </group>
      <group position={[1.5, 0, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
        <mesh position={[0, 0.5, -0.22]}>
          <boxGeometry args={[0.5, 0.6, 0.08]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
      </group>

      {/* Door */}
      <group position={[5, 0.5, -4.8]}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1.2, 2.2, 0.15]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.45, 1, 0.1]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="#c0a000" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Floating info panel */}
      <Html position={[0, 2.5, 0]} center>
        <div className="bg-background/90 backdrop-blur-md rounded-lg p-4 border border-primary/30 shadow-xl max-w-xs text-center">
          <h3 className="text-primary font-semibold mb-2">{moduleTitle}</h3>
          <p className="text-muted-foreground text-sm">{moduleContent}</p>
        </div>
      </Html>
    </group>
  );
}

// Generic Scene for other environments
function GenericScene({ environment, moduleTitle, moduleContent }: { 
  environment: string; 
  moduleTitle: string; 
  moduleContent: string;
}) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a3a4a" />
      </mesh>

      {/* Environment indicator */}
      <Text
        position={[0, 4, -5]}
        fontSize={0.8}
        color="#0ea5e9"
        anchorX="center"
        anchorY="middle"
      >
        {environment.toUpperCase()}
      </Text>

      {/* Abstract environment shapes */}
      <mesh position={[-3, 1, -3]}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[3, 0.5, -2]}>
        <cylinderGeometry args={[0.8, 0.8, 1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Floating info panel */}
      <Html position={[0, 2.5, 0]} center>
        <div className="bg-background/90 backdrop-blur-md rounded-lg p-4 border border-primary/30 shadow-xl max-w-xs text-center">
          <h3 className="text-primary font-semibold mb-2">{moduleTitle}</h3>
          <p className="text-muted-foreground text-sm">{moduleContent}</p>
        </div>
      </Html>
    </group>
  );
}

export default function VRStage({ lessonId, onClose }: VRStageProps) {
  const lesson = getLessonById(lessonId);
  
  if (!lesson) {
    return (
      <div className="h-full flex items-center justify-center bg-black text-white">
        <p>Lesson not found</p>
      </div>
    );
  }

  const currentModule = lesson.modules[0]; // Show first module by default
  const moduleTitle = currentModule?.title || lesson.title;
  const moduleContent = currentModule?.content || "";

  const renderEnvironmentScene = () => {
    switch (lesson.environment) {
      case 'airport':
        return <AirportScene moduleTitle={moduleTitle} moduleContent={moduleContent} />;
      case 'apartment':
        return <ApartmentScene moduleTitle={moduleTitle} moduleContent={moduleContent} />;
      default:
        return (
          <GenericScene 
            environment={lesson.environment} 
            moduleTitle={moduleTitle} 
            moduleContent={moduleContent} 
          />
        );
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-background/50 backdrop-blur hover:bg-background/80"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Lesson info overlay */}
      <div className="absolute top-4 left-4 z-50 bg-background/80 backdrop-blur rounded-lg p-3 max-w-xs">
        <h2 className="font-semibold text-sm">{lesson.title}</h2>
        <p className="text-xs text-muted-foreground capitalize">{lesson.environment} • {lesson.difficulty}</p>
      </div>

      {/* VR Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-background/60 backdrop-blur rounded-full px-4 py-2">
        <p className="text-xs text-muted-foreground">Drag to look around • Scroll to zoom</p>
      </div>

      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#0ea5e9" />

          {/* Environment */}
          <Environment preset="city" />

          {/* Scene based on environment */}
          {renderEnvironmentScene()}

          {/* Controls */}
          <OrbitControls 
            enablePan={false}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
