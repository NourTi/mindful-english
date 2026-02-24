/**
 * EnvironmentProps — 3D furniture & props for each VR environment.
 *
 * Each function returns a <group> of meshes representing the scene dressing.
 * All geometry is procedural (no external models needed).
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Airport ──────────────────────────────────────────────────────────

export function AirportProps() {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <group>
      {/* Check-in counter */}
      <mesh position={[0, 0.1, -2.5]} castShadow>
        <boxGeometry args={[3.5, 0.9, 0.8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Counter top */}
      <mesh position={[0, 0.56, -2.5]}>
        <boxGeometry args={[3.7, 0.06, 0.9]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Monitor on counter */}
      <mesh position={[1.0, 1.05, -2.6]}>
        <boxGeometry args={[0.6, 0.45, 0.04]} />
        <meshStandardMaterial color="#1e293b" emissive="#0ea5e9" emissiveIntensity={0.3} />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[1.0, 0.7, -2.6]}>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Departure board (back wall) */}
      <mesh ref={screenRef} position={[0, 3.2, -3.8]}>
        <boxGeometry args={[4, 1.2, 0.08]} />
        <meshStandardMaterial color="#0f172a" emissive="#0ea5e9" emissiveIntensity={0.4} />
      </mesh>
      <Text position={[0, 3.5, -3.74]} fontSize={0.18} color="#38bdf8" anchorX="center">
        DEPARTURES
      </Text>
      <Text position={[0, 3.1, -3.74]} fontSize={0.12} color="#7dd3fc" anchorX="center">
        LH 1234  Berlin     Gate B12   ON TIME
      </Text>
      <Text position={[0, 2.85, -3.74]} fontSize={0.12} color="#fbbf24" anchorX="center">
        BA 567   London     Gate A04   DELAYED
      </Text>

      {/* Stanchion barriers */}
      {[-1.8, -0.9, 0, 0.9, 1.8].map((x, i) => (
        <group key={i} position={[x, 0, 0.5]}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Rope between stanchions */}
      {[-1.35, -0.45, 0.45, 1.35].map((x, i) => (
        <mesh key={`rope-${i}`} position={[x, 0.6, 0.5]}>
          <boxGeometry args={[0.8, 0.02, 0.02]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      ))}

      {/* Luggage near counter */}
      <mesh position={[-1.5, 0.2, -1.5]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.35, 0.5, 0.22]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      <mesh position={[-1.3, 0.15, -1.2]}>
        <boxGeometry args={[0.28, 0.35, 0.18]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
    </group>
  );
}

// ─── Café ─────────────────────────────────────────────────────────────

export function CafeProps() {
  const steamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (steamRef.current) {
      steamRef.current.position.y = 1.15 + Math.sin(clock.getElapsedTime() * 1.5) * 0.04;
      const mat = steamRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.15 + Math.sin(clock.getElapsedTime() * 2) * 0.08;
    }
  });

  return (
    <group>
      {/* Main serving counter */}
      <mesh position={[-3, 0.45, -2.5]} castShadow>
        <boxGeometry args={[3, 0.9, 0.7]} />
        <meshStandardMaterial color="#5c3d2e" />
      </mesh>
      <mesh position={[-3, 0.91, -2.5]}>
        <boxGeometry args={[3.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#78553a" />
      </mesh>

      {/* Espresso machine */}
      <mesh position={[-3.5, 1.2, -2.7]}>
        <boxGeometry args={[0.5, 0.45, 0.35]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Steam wisp */}
      <mesh ref={steamRef} position={[-3.5, 1.15, -2.5]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.15} />
      </mesh>

      {/* Table 1 (near NPC) */}
      <group position={[0.5, 0, 1]}>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.04, 16]} />
          <meshStandardMaterial color="#78553a" />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.38, 8]} />
          <meshStandardMaterial color="#1c1917" metalness={0.5} />
        </mesh>
        {/* Coffee cup */}
        <mesh position={[0.12, 0.44, 0.05]}>
          <cylinderGeometry args={[0.04, 0.035, 0.07, 12]} />
          <meshStandardMaterial color="#fefce8" />
        </mesh>
      </group>

      {/* Table 2 (side) */}
      <group position={[3, 0, -1]}>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.04, 16]} />
          <meshStandardMaterial color="#78553a" />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.38, 8]} />
          <meshStandardMaterial color="#1c1917" metalness={0.5} />
        </mesh>
      </group>

      {/* Chairs */}
      {[
        [0.5, 0, 1.7],
        [3, 0, -0.3],
        [3.5, 0, -1.5],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.3, 0.03, 0.3]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
          <mesh position={[0, 0.5, -0.13]}>
            <boxGeometry args={[0.3, 0.5, 0.03]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
          {/* Legs */}
          {[[-0.12, 0.12, -0.12], [0.12, 0.12, -0.12], [-0.12, 0.12, 0.12], [0.12, 0.12, 0.12]].map(
            ([lx, ly, lz], j) => (
              <mesh key={j} position={[lx, ly, lz]}>
                <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
                <meshStandardMaterial color="#1c1917" />
              </mesh>
            )
          )}
        </group>
      ))}

      {/* Menu board */}
      <mesh position={[-4.5, 2.5, -3.8]}>
        <boxGeometry args={[2, 1.5, 0.06]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      <Text position={[-4.5, 3, -3.74]} fontSize={0.18} color="#fbbf24" anchorX="center">
        ☕ MENU
      </Text>
      <Text position={[-4.5, 2.65, -3.74]} fontSize={0.1} color="#e2e8f0" anchorX="center">
        {'Espresso . . . . €2.50\nCappuccino . . . €3.20\nLatte . . . . . . €3.50'}
      </Text>

      {/* Warm pendant lights */}
      {[-2, 0.5, 3].map((x, i) => (
        <group key={`light-${i}`} position={[x, 3.5, -1]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.25, 0.2, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
          </mesh>
          <pointLight position={[0, -0.3, 0]} intensity={0.4} color="#fbbf24" distance={5} />
        </group>
      ))}
    </group>
  );
}

// ─── Job Interview ────────────────────────────────────────────────────

export function JobInterviewProps() {
  return (
    <group>
      {/* Large desk */}
      <mesh position={[0, 0.38, -2]} castShadow>
        <boxGeometry args={[2.5, 0.06, 1.0]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Desk legs */}
      {[[-1.15, 0.17, -2.4], [1.15, 0.17, -2.4], [-1.15, 0.17, -1.6], [1.15, 0.17, -1.6]].map(
        ([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.06, 0.35, 0.06]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        )
      )}

      {/* Laptop on desk */}
      <mesh position={[0.5, 0.44, -2.1]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.4, 0.28, 0.02]} />
        <meshStandardMaterial color="#1e293b" emissive="#60a5fa" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.5, 0.41, -1.9]}>
        <boxGeometry args={[0.4, 0.02, 0.28]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Notepad + pen */}
      <mesh position={[-0.5, 0.42, -1.9]}>
        <boxGeometry args={[0.2, 0.01, 0.28]} />
        <meshStandardMaterial color="#fefce8" />
      </mesh>
      <mesh position={[-0.35, 0.43, -1.85]} rotation={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>

      {/* Water glass */}
      <mesh position={[-0.8, 0.46, -2.2]}>
        <cylinderGeometry args={[0.03, 0.025, 0.1, 12]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.4} />
      </mesh>

      {/* Office chair (interviewer side) */}
      <group position={[0, 0, -3]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.45, 0.06, 0.4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.65, -0.18]}>
          <boxGeometry args={[0.45, 0.55, 0.06]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
      </group>

      {/* Visitor chair */}
      <group position={[0, 0, 0.5]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.4]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, 0.52, -0.18]}>
          <boxGeometry args={[0.4, 0.45, 0.04]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        {/* Legs */}
        {[[-0.17, 0.13, -0.17], [0.17, 0.13, -0.17], [-0.17, 0.13, 0.17], [0.17, 0.13, 0.17]].map(
          ([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]}>
              <cylinderGeometry args={[0.02, 0.02, 0.26, 6]} />
              <meshStandardMaterial color="#475569" metalness={0.5} />
            </mesh>
          )
        )}
      </group>

      {/* Bookshelf on side */}
      <group position={[4.5, 0, -2]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[1.2, 3, 0.35]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Shelves with colored book blocks */}
        {[0.5, 1.2, 1.9, 2.6].map((y, i) => (
          <group key={i}>
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[1.1, 0.03, 0.3]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[-0.2, y + 0.12, 0]}>
              <boxGeometry args={[0.35, 0.2, 0.18]} />
              <meshStandardMaterial color={['#1e40af', '#7f1d1d', '#065f46', '#6b21a8'][i]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Company logo / clock on wall */}
      <mesh position={[0, 3.5, -3.85]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 24]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Overhead panel light */}
      <mesh position={[0, 4.3, -1.5]}>
        <boxGeometry args={[2.5, 0.04, 0.5]} />
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, 4, -1.5]} intensity={0.6} color="#f8fafc" distance={8} />
    </group>
  );
}

// ─── Flatshare / Apartment ────────────────────────────────────────────

export function FlatshareProps() {
  return (
    <group>
      {/* Kitchen counter */}
      <mesh position={[-3.5, 0.45, -2.5]} castShadow>
        <boxGeometry args={[3, 0.9, 0.6]} />
        <meshStandardMaterial color="#78553a" />
      </mesh>
      <mesh position={[-3.5, 0.91, -2.5]}>
        <boxGeometry args={[3.2, 0.04, 0.7]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>

      {/* Fridge */}
      <mesh position={[-5.2, 0.9, -2.8]}>
        <boxGeometry args={[0.7, 1.8, 0.6]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.3} />
      </mesh>
      <mesh position={[-5.2, 1.2, -2.49]}>
        <boxGeometry args={[0.04, 0.3, 0.01]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} />
      </mesh>

      {/* Sofa */}
      <group position={[2.5, 0, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.8, 0.35, 0.8]} />
          <meshStandardMaterial color="#7c3aed" />
        </mesh>
        <mesh position={[0, 0.55, -0.3]}>
          <boxGeometry args={[1.8, 0.5, 0.2]} />
          <meshStandardMaterial color="#6d28d9" />
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.85, 0.4, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.8]} />
          <meshStandardMaterial color="#6d28d9" />
        </mesh>
        <mesh position={[0.85, 0.4, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.8]} />
          <meshStandardMaterial color="#6d28d9" />
        </mesh>
        {/* Cushion */}
        <mesh position={[0.4, 0.5, 0.05]}>
          <boxGeometry args={[0.35, 0.12, 0.35]} />
          <meshStandardMaterial color="#a78bfa" />
        </mesh>
      </group>

      {/* Coffee table */}
      <mesh position={[2.5, 0.22, 1.2]}>
        <boxGeometry args={[0.9, 0.04, 0.5]} />
        <meshStandardMaterial color="#78553a" />
      </mesh>
      {[[-0.35, 0.1, -0.2], [0.35, 0.1, -0.2], [-0.35, 0.1, 0.2], [0.35, 0.1, 0.2]].map(
        ([x, y, z], i) => (
          <mesh key={i} position={[2.5 + x, y, 1.2 + z]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
        )
      )}

      {/* TV on wall */}
      <mesh position={[2.5, 2, -3.85]}>
        <boxGeometry args={[2, 1.1, 0.06]} />
        <meshStandardMaterial color="#0f172a" emissive="#334155" emissiveIntensity={0.15} />
      </mesh>

      {/* Rug */}
      <mesh position={[1.5, -0.48, 0.5]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[3, 2.5]} />
        <meshStandardMaterial color="#c4b5a0" />
      </mesh>

      {/* Potted plant */}
      <group position={[4.5, 0, -2]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.3, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color="#166534" />
        </mesh>
      </group>

      {/* Warm lighting */}
      <pointLight position={[2.5, 3, 0]} intensity={0.5} color="#fbbf24" distance={6} />
    </group>
  );
}

// ─── Hotel ────────────────────────────────────────────────────────────

export function HotelProps() {
  return (
    <group>
      {/* Reception desk */}
      <mesh position={[0, 0.45, -2.5]} castShadow>
        <boxGeometry args={[4, 0.9, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Marble counter top */}
      <mesh position={[0, 0.91, -2.5]}>
        <boxGeometry args={[4.2, 0.05, 0.9]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Desk bell */}
      <mesh position={[0.8, 0.98, -2.3]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 0.94, -2.3]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
        <meshStandardMaterial color="#b8860b" metalness={0.7} />
      </mesh>

      {/* Monitor */}
      <mesh position={[-0.8, 1.1, -2.7]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.38, 0.03]} />
        <meshStandardMaterial color="#0f172a" emissive="#60a5fa" emissiveIntensity={0.2} />
      </mesh>

      {/* Key rack / room numbers on back wall */}
      <mesh position={[3, 2, -3.85]}>
        <boxGeometry args={[1.5, 2, 0.06]} />
        <meshStandardMaterial color="#2d1b0e" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[2.6 + (i % 3) * 0.35, 2.5 - Math.floor(i / 3) * 0.5, -3.8]}>
          <boxGeometry args={[0.25, 0.18, 0.03]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} />
        </mesh>
      ))}

      {/* Hotel sign */}
      <Text position={[0, 3.8, -3.8]} fontSize={0.35} color="#fbbf24" anchorX="center">
        HOTEL
      </Text>

      {/* Luggage cart */}
      <group position={[3.5, 0, 0.5]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.8, 0.04, 0.5]} />
          <meshStandardMaterial color="#b8860b" metalness={0.5} />
        </mesh>
        {/* Wheels */}
        {[[-0.35, 0.04, -0.2], [0.35, 0.04, -0.2], [-0.35, 0.04, 0.2], [0.35, 0.04, 0.2]].map(
          ([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 8]} />
              <meshStandardMaterial color="#1c1917" />
            </mesh>
          )
        )}
        {/* Handle */}
        <mesh position={[-0.42, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
          <meshStandardMaterial color="#b8860b" metalness={0.5} />
        </mesh>
        {/* Suitcase on cart */}
        <mesh position={[0.05, 0.35, 0]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.25]} />
          <meshStandardMaterial color="#1e3a5f" />
        </mesh>
      </group>

      {/* Potted palms */}
      {[-4, 4].map((x, i) => (
        <group key={i} position={[x, 0, -2.5]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.18, 0.15, 0.4, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
            <meshStandardMaterial color="#4d3319" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.3, 8, 6]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}

      {/* Chandelier-style lighting */}
      <pointLight position={[0, 4, -1]} intensity={0.7} color="#fef3c7" distance={10} />
      <mesh position={[0, 4.2, -1]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ─── Medical Clinic ───────────────────────────────────────────────────

export function MedicalClinicProps() {
  const monitorRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (monitorRef.current) {
      const mat = monitorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(clock.getElapsedTime() * 1.2) * 0.1;
    }
  });

  return (
    <group>
      {/* Examination table */}
      <group position={[-1, 0, -1.5]}>
        {/* Base / frame */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.8, 0.08, 1.8]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Padded top */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.75, 0.1, 1.7]} />
          <meshStandardMaterial color="#bfdbfe" />
        </mesh>
        {/* Raised pillow end */}
        <mesh position={[0, 0.52, -0.7]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.6, 0.06, 0.4]} />
          <meshStandardMaterial color="#93c5fd" />
        </mesh>
        {/* Legs */}
        {[[-0.3, 0.16, -0.75], [0.3, 0.16, -0.75], [-0.3, 0.16, 0.75], [0.3, 0.16, 0.75]].map(
          ([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.5} />
            </mesh>
          )
        )}
      </group>

      {/* Curtain divider rail (curved) */}
      <group position={[1.5, 0, -0.5]}>
        {/* Ceiling rail */}
        <mesh position={[0, 3.8, 0]}>
          <boxGeometry args={[0.04, 0.04, 3.5]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
        {/* Curtain panels */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((z, i) => (
          <mesh key={i} position={[0, 2, z]}>
            <boxGeometry args={[0.03, 3.6, 0.5]} />
            <meshStandardMaterial color="#dbeafe" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Doctor's desk */}
      <mesh position={[3, 0.38, -2.5]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.7]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      {[[-0.7, 0.17, -2.8], [0.7, 0.17, -2.8], [-0.7, 0.17, -2.2], [0.7, 0.17, -2.2]].map(
        ([x, y, z], i) => (
          <mesh key={i} position={[3 + x, y, z]}>
            <boxGeometry args={[0.05, 0.35, 0.05]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
        )
      )}

      {/* Monitor on desk */}
      <mesh ref={monitorRef} position={[3.4, 0.7, -2.7]}>
        <boxGeometry args={[0.5, 0.35, 0.03]} />
        <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[3.4, 0.45, -2.7]}>
        <cylinderGeometry args={[0.03, 0.05, 0.12, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Instrument tray / cart */}
      <group position={[-2.8, 0, -0.5]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.6, 0.03, 0.4]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} />
        </mesh>
        {/* Wheels */}
        {[[-0.15, 0.03, -0.1], [0.15, 0.03, -0.1], [0, 0.03, 0.1]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
        {/* Instruments on tray */}
        <mesh position={[-0.15, 0.75, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 6]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.05, 0.75, 0.05]} rotation={[0, 0.5, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15, 6]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.15, 0.74, -0.05]}>
          <boxGeometry args={[0.08, 0.02, 0.12]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.7} />
        </mesh>
      </group>

      {/* Blood pressure monitor on wall */}
      <group position={[-3, 1.5, -3.8]}>
        <mesh>
          <boxGeometry args={[0.25, 0.35, 0.08]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.15, 0.2, 0.02]} />
          <meshStandardMaterial color="#0f172a" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Anatomical poster on wall */}
      <mesh position={[0, 2.5, -3.85]}>
        <boxGeometry args={[1.2, 1.6, 0.04]} />
        <meshStandardMaterial color="#fefce8" />
      </mesh>
      <Text position={[0, 3.1, -3.82]} fontSize={0.1} color="#1e293b" anchorX="center">
        ANATOMY REFERENCE
      </Text>

      {/* Stool for doctor */}
      <group position={[3, 0, -1.8]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.35, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
        {/* Wheels */}
        {[0, 1.2, 2.4, 3.6, 4.8].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.15, 0.03, Math.sin(a) * 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
      </group>

      {/* Hand sanitizer dispenser */}
      <group position={[4.8, 1.3, -1]}>
        <mesh>
          <boxGeometry args={[0.1, 0.2, 0.08]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[0, -0.15, 0.02]}>
          <boxGeometry args={[0.04, 0.08, 0.03]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.4} />
        </mesh>
      </group>

      {/* Bright clinical lighting */}
      <pointLight position={[0, 4, -1]} intensity={0.8} color="#f0f9ff" distance={10} />
      <pointLight position={[-1, 3, -1.5]} intensity={0.3} color="#e0f2fe" distance={5} />
    </group>
  );
}

// ─── Default / Generic ────────────────────────────────────────────────

export function DefaultProps() {
  return (
    <group>
      {/* Simple desk */}
      <mesh position={[0, 0.38, -2]} castShadow>
        <boxGeometry args={[1.8, 0.06, 0.8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {[[-0.8, 0.17, -2.3], [0.8, 0.17, -2.3], [-0.8, 0.17, -1.7], [0.8, 0.17, -1.7]].map(
        ([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[0.05, 0.35, 0.05]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        )
      )}
    </group>
  );
}
