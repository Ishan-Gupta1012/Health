"use client";

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { useControls, Leva } from 'leva';

function Particles({ count = 20 }) {
  const { viewport, mouse } = useThree();
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => {
      const t = Math.random() * Math.PI * 2;
      const x = Math.cos(t) * THREE.MathUtils.randFloat(2, viewport.width / 2);
      const y = Math.sin(t) * THREE.MathUtils.randFloat(2, viewport.height / 2);
      const z = THREE.MathUtils.randFloat(-5, 5);
      const speed = THREE.MathUtils.randFloat(0.01, 0.05);

      return {
        position: new THREE.Vector3(x, y, z),
        initialPosition: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, speed, 0),
      };
    });
  }, [count, viewport.width, viewport.height]);

  useFrame((state, delta) => {
    if (!instancedMeshRef.current) return;
    
    const target = new THREE.Vector3(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2, 0);

    for (let i = 0; i < count; i++) {
      const particle = particles[i];

      // Update position
      particle.position.add(particle.velocity);

      // Parallax effect
      const parallaxFactor = 0.1;
      const parallaxOffset = new THREE.Vector3().copy(target).multiplyScalar(parallaxFactor);
      const currentPosition = new THREE.Vector3().copy(particle.initialPosition).add( parallaxOffset);
      
      const matrix = new THREE.Matrix4();
      instancedMeshRef.current.getMatrixAt(i, matrix);
      const position = new THREE.Vector3().setFromMatrixPosition(matrix);
      position.lerp(currentPosition, 0.05);
      matrix.setPosition(position);
      instancedMeshRef.current.setMatrixAt(i, matrix);

      // Reset particles that go off-screen
      if (particle.position.y > viewport.height / 2 + 2) {
        particle.position.y = -viewport.height / 2 - 2;
        particle.initialPosition.y = -viewport.height / 2 - 2;
      }
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  const { color, emissiveIntensity } = useControls({
    color: '#FF6F61',
    emissiveIntensity: { value: 1.0, min: 0, max: 2 },
  })

  return (
    <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissiveIntensity} />
    </instancedMesh>
  );
}

function BackgroundGradient() {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#E6E6FA') },
      uColorB: { value: new THREE.Color('#B2DFDB') },
      uColorC: { value: new THREE.Color('#D6F2F7') },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const { colorA, colorB, colorC } = useControls({
      colorA: '#E6E6FA', // Lavender Fog
      colorB: '#B2DFDB', // Aero Blue
      colorC: '#D6F2F7', // Powder Blue
  });

  if (materialRef.current) {
    materialRef.current.uniforms.uColorA.value.set(colorA);
    materialRef.current.uniforms.uColorB.value.set(colorB);
    materialRef.current.uniforms.uColorC.value.set(colorC);
  }


  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float time = uTime * 0.1;
            
            vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.6, uv.y + sin(time) * 0.2));
            color = mix(color, uColorC, smoothstep(0.4, 1.0, uv.y + cos(time) * 0.2));

            gl_FragColor = vec4(color, 1.0);
          }
        `}
        uniforms={uniforms}
      />
    </mesh>
  );
}


export function HealthNestBackground() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
      }}
    >
      <Leva hidden={isProduction} />
      <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <BackgroundGradient />
          <Particles />
      </Canvas>
    </div>
  );
}