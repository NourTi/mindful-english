import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  connections: number[];
}

const NeuralNodes = ({ count = 80 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const nodes = useMemo(() => {
    const nodeData: NodeData[] = [];
    for (let i = 0; i < count; i++) {
      nodeData.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.001
        ),
        connections: []
      });
    }

    // Create connections between nearby nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = nodeData[i].position.distanceTo(nodeData[j].position);
        if (dist < 3) {
          nodeData[i].connections.push(j);
        }
      }
    }

    return nodeData;
  }, [count]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    nodes.forEach((node, i) => {
      pos[i * 3] = node.position.x;
      pos[i * 3 + 1] = node.position.y;
      pos[i * 3 + 2] = node.position.z;
    });
    return pos;
  }, [nodes, count]);

  const linePositions = useMemo(() => {
    const lines: number[] = [];
    nodes.forEach((node, i) => {
      node.connections.forEach(j => {
        lines.push(
          node.position.x, node.position.y, node.position.z,
          nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
        );
      });
    });
    return new Float32Array(lines);
  }, [nodes]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const linePositionsArray = linesRef.current.geometry.attributes.position.array as Float32Array;

    let lineIndex = 0;

    nodes.forEach((node, i) => {
      // Apply velocity
      node.position.add(node.velocity);

      // Parallax effect from mouse
      const parallaxX = mousePosition.current.x * 0.3;
      const parallaxY = mousePosition.current.y * 0.3;

      // Boundary check with soft bounce
      if (Math.abs(node.position.x) > 6) node.velocity.x *= -1;
      if (Math.abs(node.position.y) > 4) node.velocity.y *= -1;
      if (Math.abs(node.position.z) > 3) node.velocity.z *= -1;

      // Update point positions with parallax
      positionsArray[i * 3] = node.position.x + parallaxX * (node.position.z + 3) * 0.1;
      positionsArray[i * 3 + 1] = node.position.y + parallaxY * (node.position.z + 3) * 0.1;
      positionsArray[i * 3 + 2] = node.position.z;

      // Update line positions
      node.connections.forEach(j => {
        linePositionsArray[lineIndex] = positionsArray[i * 3];
        linePositionsArray[lineIndex + 1] = positionsArray[i * 3 + 1];
        linePositionsArray[lineIndex + 2] = positionsArray[i * 3 + 2];
        linePositionsArray[lineIndex + 3] = positionsArray[j * 3];
        linePositionsArray[lineIndex + 4] = positionsArray[j * 3 + 1];
        linePositionsArray[lineIndex + 5] = positionsArray[j * 3 + 2];
        lineIndex += 6;
      });
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <>
      {/* Neural nodes (particles) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#22D3EE"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Synapses (connections) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0EA5E9"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
};

const PulsingCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.setScalar(scale);
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshBasicMaterial
        color="#F59E0B"
        wireframe
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

const AmbientParticles = ({ count = 50 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#F59E0B"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

interface NeuralNetwork3DProps {
  className?: string;
}

const NeuralNetwork3D = ({ className = '' }: NeuralNetwork3DProps) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        {/* Ambient light for visibility */}
        <ambientLight intensity={0.3} />

        {/* Neural network */}
        <NeuralNodes count={80} />

        {/* Central pulsing core */}
        <PulsingCore />

        {/* Ambient floating particles */}
        <AmbientParticles count={40} />
      </Canvas>
    </div>
  );
};

export default NeuralNetwork3D;
