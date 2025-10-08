"use client";

import * as THREE from 'three';
import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Trail, Float } from '@react-three/drei';
import { Leva, useControls } from 'leva';

function DNA() {
  const {
    radius,
    tube,
    tubularSegments,
    radialSegments,
    p,
    q,
    height,
    turns,
    color,
    emissive,
    emissiveIntensity,
  } = useControls('DNA Helix', {
    radius: { value: 1, min: 0.5, max: 3, step: 0.1 },
    tube: { value: 0.2, min: 0.05, max: 0.5, step: 0.01 },
    tubularSegments: { value: 150, min: 50, max: 300, step: 10 },
    radialSegments: { value: 20, min: 10, max: 40, step: 1 },
    p: { value: 2, min: 1, max: 5, step: 1 },
    q: { value: 3, min: 1, max: 5, step: 1 },
    height: { value: 15, min: 5, max: 30, step: 1 },
    turns: { value: 3.5, min: 1, max: 10, step: 0.5 },
    color: '#87CEEB',
    emissive: '#87CEEB',
    emissiveIntensity: { value: 0.2, min: 0, max: 1 },
  });
  
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
    }
  });

  const curve = useMemo(() => {
    class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
        scale: number;
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t: number) {
            const tx = Math.cos(2 * Math.PI * t * p) * radius;
            const ty = Math.sin(2 * Math.PI * t * q) * radius;
            const tz = t * height - height / 2;
            return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    return new CustomSinCurve(1);
  }, [radius, p, q, height]);


  const Strand = ({ offset }: { offset: number }) => {
    const strandRef = useRef<THREE.Mesh>(null!);
    
    useFrame(({ clock }) => {
        if(strandRef.current) {
            const time = clock.getElapsedTime();
            const positions = (strandRef.current.geometry as THREE.BufferGeometry).attributes.position;
            for(let i = 0; i < positions.count; i++) {
                const t = i / (positions.count - 1);
                const point = curve.getPoint(t);
                const angle = 2 * Math.PI * turns * t + offset + time * 0.1;
                const x = point.x + tube * Math.cos(angle);
                const z = point.y + tube * Math.sin(angle);
                positions.setXYZ(i, x, point.z, z);
            }
            positions.needsUpdate = true;
        }
    })
    
    return (
      <mesh ref={strandRef}>
        <tubeGeometry args={[curve, tubularSegments, tube, radialSegments, false]} />
        <meshStandardMaterial 
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            metalness={0.2}
            roughness={0.5}
            transparent
            opacity={0.8}
        />
      </mesh>
    );
  };
  
  const connectors = useMemo(() => {
    const points = [];
    for (let i = 0; i < tubularSegments; i++) {
      const t = i / tubularSegments;
      const point1 = curve.getPoint(t);
      const angle1 = 2 * Math.PI * turns * t;
      const p1 = new THREE.Vector3(point1.x + tube * Math.cos(angle1), point1.z, point1.y + tube * Math.sin(angle1));
      
      const angle2 = 2 * Math.PI * turns * t + Math.PI;
      const p2 = new THREE.Vector3(point1.x + tube * Math.cos(angle2), point1.z, point1.y + tube * Math.sin(angle2));
      
      points.push(p1, p2);
    }
    return points;
  }, [tubularSegments, turns, tube, curve]);
  
  return (
    <group ref={ref}>
      <Strand offset={0} />
      <Strand offset={Math.PI} />
       <lineSegments>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={connectors.length}
            array={new Float32Array(connectors.flatMap(p => p.toArray()))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function Plexus() {
    const count = 100;
    const {viewport} = useThree();
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * viewport.width * 2;
            const y = (Math.random() - 0.5) * viewport.height * 2;
            const z = (Math.random() - 0.5) * 20;

            temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
        }
        return temp;
    }, [count, viewport.width, viewport.height]);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const ref = useRef<THREE.InstancedMesh>(null!);
    const lineRef = useRef<THREE.LineSegments>(null!);

    useFrame(({ mouse }) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);
            particle.mx += (mouse.x * viewport.width - particle.mx) * 0.01;
            particle.my += (mouse.y * viewport.height - particle.my) * 0.01;

            dummy.position.set(
              (particle.mx / 10) * a + x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
              (particle.my / 10) * b + y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
              (particle.my / 10) * b + z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            ref.current.setMatrixAt(i, dummy.matrix);
        });
        ref.current.instanceMatrix.needsUpdate = true;
        
        const positions = lineRef.current.geometry.attributes.position.array as Float32Array;
        let vertexpos = 0;
        
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const p1pos = new THREE.Vector3();
                const p2pos = new THREE.Vector3();
                const tempMatrix = new THREE.Matrix4();
                
                ref.current.getMatrixAt(i, tempMatrix);
                p1pos.setFromMatrixPosition(tempMatrix);

                ref.current.getMatrixAt(j, tempMatrix);
                p2pos.setFromMatrixPosition(tempMatrix);
                
                const dist = p1pos.distanceTo(p2pos);

                if (dist < 2.5) {
                    positions[vertexpos++] = p1pos.x;
                    positions[vertexpos++] = p1pos.y;
                    positions[vertexpos++] = p1pos.z;
                    positions[vertexpos++] = p2pos.x;
                    positions[vertexpos++] = p2pos.y;
                    positions[vertexpos++] = p2pos.z;
                }
            }
        }
        lineRef.current.geometry.setDrawRange(0, vertexpos / 3);
        lineRef.current.geometry.attributes.position.needsUpdate = true;
    });

    const lineGeo = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * count * 3 * 2);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geometry;
    }, [count]);

    return (
        <>
            <instancedMesh ref={ref} args={[undefined, undefined, count]}>
                <icosahedronGeometry args={[0.08, 0]} />
                <meshStandardMaterial color="#87CEEB" roughness={0.5} />
            </instancedMesh>
            <lineSegments ref={lineRef} geometry={lineGeo}>
                <lineBasicMaterial color="#87CEEB" transparent opacity={0.2} />
            </lineSegments>
        </>
    );
}

export function DnaBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, background: 'hsl(var(--background))' }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} color="#E6E6FA" intensity={0.5} />
            <pointLight position={[-10, -10, -10]} color="#B2DFDB" intensity={0.5} />
            <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
                <DNA />
            </Float>
            <Plexus />
        </Canvas>
        <Leva hidden={process.env.NODE_ENV === 'production'} />
    </div>
  );
}
