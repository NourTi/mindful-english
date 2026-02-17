import { useRef, useMemo, useState, Suspense, lazy } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Html } from '@react-three/drei';
import type { NPCEmotion } from '@/lib/npcEngine';
import { isSmplpixAvailable } from '@/lib/smplpixClient';
import * as THREE from 'three';

const SmplAvatar3D = lazy(() => import('@/components/SmplAvatar3D'));

interface ImmersiveNPCSceneProps {
  npcUtterance: string;
  npcEmotion: NPCEmotion;
  environment: string;
  phase: string;
  is3D: boolean;
  characterId?: string;
  lessonId?: string;
  turnCount?: number;
}

// ─── NPC Avatar with emotion-driven animation ─────────────────────────

function NPCAvatar({ emotion }: { emotion: NPCEmotion }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  const emotionConfig = useMemo(() => ({
    calm: { speed: 0.5, amplitude: 0.02, lean: 0, color: '#64748b' },
    supportive: { speed: 0.8, amplitude: 0.04, lean: 0.1, color: '#3b82f6' },
    pushing: { speed: 1.5, amplitude: 0.06, lean: 0, color: '#f59e0b' },
    wrapping_up: { speed: 0.3, amplitude: 0.01, lean: 0.05, color: '#10b981' },
  }), []);

  const config = emotionConfig[emotion];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Idle breathing / sway
      groupRef.current.position.y = Math.sin(t * config.speed) * config.amplitude;
      groupRef.current.rotation.z = Math.sin(t * config.speed * 0.5) * 0.02;
    }
    if (headRef.current) {
      // Subtle head movement
      headRef.current.rotation.y = Math.sin(t * config.speed * 0.7) * 0.05;
      // Lean-in for supportive/wrapping_up
      headRef.current.rotation.x = -config.lean * 0.3;
    }
    if (bodyRef.current) {
      // Lean-in
      bodyRef.current.rotation.x = -config.lean * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.35, 1.0, 8, 16]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 1.9, 0.22]}>
        <sphereGeometry args={[0.04]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.08, 1.9, 0.22]}>
        <sphereGeometry args={[0.04]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Mouth - changes with emotion */}
      <mesh position={[0, 1.78, 0.24]}>
        <boxGeometry args={[
          emotion === 'pushing' ? 0.12 : 0.08,
          0.02,
          0.02
        ]} />
        <meshStandardMaterial color={emotion === 'supportive' ? '#ef4444' : '#475569'} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.5, 0.6, 0]} rotation={[0, 0, emotion === 'supportive' ? -0.3 : -0.1]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      <mesh position={[0.5, 0.6, 0]} rotation={[0, 0, emotion === 'supportive' ? 0.3 : 0.1]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
    </group>
  );
}

// ─── Environment scenes ───────────────────────────────────────────────

function EnvironmentScene({ environment }: { environment: string }) {
  const envColors: Record<string, { floor: string; wall: string }> = {
    airport: { floor: '#2a2a35', wall: '#1a1a24' },
    cafe: { floor: '#3d3228', wall: '#e8dcc8' },
    job_interview: { floor: '#1e293b', wall: '#334155' },
    flatshare: { floor: '#3d3228', wall: '#e8dcc8' },
  };
  const colors = envColors[environment] || { floor: '#2a3a4a', wall: '#334155' };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={colors.floor} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 2, -4]}>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color={colors.wall} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-6, 2, 0]}>
        <boxGeometry args={[0.2, 5, 10]} />
        <meshStandardMaterial color={colors.wall} opacity={0.6} transparent />
      </mesh>
      <mesh position={[6, 2, 0]}>
        <boxGeometry args={[0.2, 5, 10]} />
        <meshStandardMaterial color={colors.wall} opacity={0.6} transparent />
      </mesh>
      {/* Environment label */}
      <Text
        position={[0, 4, -3.8]}
        fontSize={0.4}
        color="#0ea5e9"
        anchorX="center"
      >
        {environment.toUpperCase().replace(/_/g, ' ')}
      </Text>
    </group>
  );
}

// ─── Speech Bubble ────────────────────────────────────────────────────

function SpeechBubble({ text, emotion }: { text: string; emotion: NPCEmotion }) {
  const emotionColors: Record<NPCEmotion, string> = {
    calm: 'border-muted-foreground/30',
    supportive: 'border-primary/50',
    pushing: 'border-yellow-500/50',
    wrapping_up: 'border-green-500/50',
  };

  return (
    <Html position={[0, 3, 0]} center distanceFactor={6}>
      <div className={`bg-background/95 backdrop-blur-md rounded-xl p-4 border-2 ${emotionColors[emotion]} shadow-2xl max-w-[280px] text-center animate-in fade-in duration-300`}>
        <p className="text-sm text-foreground leading-relaxed">{text || '...'}</p>
        {/* Emotion indicator */}
        <div className="mt-2 flex items-center justify-center gap-1">
          <span className={`inline-block w-2 h-2 rounded-full ${
            emotion === 'calm' ? 'bg-muted-foreground' :
            emotion === 'supportive' ? 'bg-primary' :
            emotion === 'pushing' ? 'bg-yellow-500' :
            'bg-green-500'
          }`} />
          <span className="text-xs text-muted-foreground capitalize">{emotion}</span>
        </div>
      </div>
    </Html>
  );
}

// ─── 3D Scene Composition ─────────────────────────────────────────────

function Scene3DContent({ npcUtterance, npcEmotion, environment, characterId, lessonId, turnCount }: {
  npcUtterance: string;
  npcEmotion: NPCEmotion;
  environment: string;
  characterId?: string;
  lessonId?: string;
  turnCount?: number;
}) {
  const [useSmplpix, setUseSmplpix] = useState(isSmplpixAvailable());

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 4, -2]} intensity={0.3} color="#0ea5e9" />
      <Environment preset="city" />

      <EnvironmentScene environment={environment} />

      {/* Neural avatar (SMPLpix) or procedural fallback */}
      {useSmplpix && characterId && lessonId ? (
        <Suspense fallback={<NPCAvatar emotion={npcEmotion} />}>
          <SmplAvatar3D
            characterId={characterId}
            lessonId={lessonId}
            emotion={npcEmotion}
            turnCount={turnCount ?? 0}
            onFallback={() => setUseSmplpix(false)}
          />
        </Suspense>
      ) : (
        <NPCAvatar emotion={npcEmotion} />
      )}

      <SpeechBubble text={npcUtterance} emotion={npcEmotion} />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 1.2, 0]}
      />
    </>
  );
}

// ─── 2D Fallback ──────────────────────────────────────────────────────

function FlatNPCView({ npcUtterance, npcEmotion, environment, phase }: {
  npcUtterance: string;
  npcEmotion: NPCEmotion;
  environment: string;
  phase: string;
}) {
  const emotionEmoji: Record<NPCEmotion, string> = {
    calm: '😊',
    supportive: '🤗',
    pushing: '🤔',
    wrapping_up: '👋',
  };

  const emotionBg: Record<NPCEmotion, string> = {
    calm: 'bg-muted',
    supportive: 'bg-primary/10',
    pushing: 'bg-yellow-500/10',
    wrapping_up: 'bg-green-500/10',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-6">
      {/* Environment header */}
      <div className="text-xs text-muted-foreground uppercase tracking-wider">
        {environment.replace(/_/g, ' ')} • {phase}
      </div>

      {/* NPC Avatar */}
      <div className={`relative w-28 h-28 rounded-full ${emotionBg[npcEmotion]} flex items-center justify-center text-5xl transition-all duration-500`}>
        {emotionEmoji[npcEmotion]}
        {/* Pulse ring for supportive */}
        {npcEmotion === 'supportive' && (
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
        )}
      </div>

      {/* Speech bubble */}
      <div className={`max-w-md p-5 rounded-2xl ${emotionBg[npcEmotion]} border border-border shadow-lg text-center`}>
        <p className="text-foreground leading-relaxed">
          {npcUtterance || (
            <span className="text-muted-foreground italic">NPC is thinking...</span>
          )}
        </p>
      </div>

      {/* Emotion label */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={`w-2 h-2 rounded-full ${
          npcEmotion === 'calm' ? 'bg-muted-foreground' :
          npcEmotion === 'supportive' ? 'bg-primary' :
          npcEmotion === 'pushing' ? 'bg-yellow-500' :
          'bg-green-500'
        }`} />
        NPC mood: {npcEmotion}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

export default function ImmersiveNPCScene({
  npcUtterance,
  npcEmotion,
  environment,
  phase,
  is3D,
  characterId,
  lessonId,
  turnCount,
}: ImmersiveNPCSceneProps) {
  if (!is3D) {
    return (
      <FlatNPCView
        npcUtterance={npcUtterance}
        npcEmotion={npcEmotion}
        environment={environment}
        phase={phase}
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 55 }}
      shadows
      style={{ background: '#0f172a' }}
    >
      <Scene3DContent
        npcUtterance={npcUtterance}
        npcEmotion={npcEmotion}
        environment={environment}
        characterId={characterId}
        lessonId={lessonId}
        turnCount={turnCount}
      />
    </Canvas>
  );
}
