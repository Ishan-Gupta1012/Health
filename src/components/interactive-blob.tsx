"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

class Blob {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  bounds: { x: number; y: number };

  constructor(scene: THREE.Scene, bounds: { x: number, y: number }) {
    this.bounds = bounds;
    const geometry = new THREE.IcosahedronGeometry(1, 64);
    this.material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 v_normal;
        varying vec3 v_position;
        uniform float u_time;
        uniform float u_radius;
        
        // Simplex 3D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857; // 1.0/7.0
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }

        void main() {
          v_normal = normal;
          v_position = position;

          float noise = snoise(position * 2.0 + u_time * 0.5) * 0.2;
          vec3 new_position = position + normal * (noise + 0.1);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position * u_radius, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_normal;
        varying vec3 v_position;
        uniform vec3 u_color_a;
        uniform vec3 u_color_b;
        uniform vec3 u_color_c;

        void main() {
          float mix1 = smoothstep(0.0, 1.0, (v_position.x + 0.5));
          vec3 color_ab = mix(u_color_a, u_color_b, mix1);
          
          float mix2 = smoothstep(0.0, 1.0, (v_position.y + 0.5));
          vec3 color_final = mix(color_ab, u_color_c, mix2);
          
          float fresnel = dot(v_normal, vec3(0, 0, 1.0));
          fresnel = pow(1.0 - fresnel, 3.0);
          
          gl_FragColor = vec4(color_final + fresnel * 0.5, 1.0);
        }
      `,
      uniforms: {
        u_time: { value: 0 },
        u_radius: { value: 1.0 },
        u_color_a: { value: new THREE.Color('#e0c3fc') },
        u_color_b: { value: new THREE.Color('#8ec5fc') },
        u_color_c: { value: new THREE.Color('#fbc2eb') },
      },
      transparent: true,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.x = gsap.utils.random(-bounds.x, bounds.x);
    this.mesh.position.y = gsap.utils.random(-bounds.y, bounds.y);
    this.mesh.position.z = gsap.utils.random(-5, 0);

    const randomScale = gsap.utils.random(0.5, 2.5);
    this.mesh.scale.set(randomScale, randomScale, randomScale);

    scene.add(this.mesh);
  }

  update(elapsedTime: number) {
    this.material.uniforms.u_time.value = elapsedTime;
  }
}

export const InteractiveBlob = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    containerRef.current.appendChild(renderer.domElement);
    
    const blobs: Blob[] = [];
    const bounds = { x: 15, y: 10 };
    for(let i=0; i<6; i++) {
        blobs.push(new Blob(scene, bounds));
    }
    
    const mouse = new THREE.Vector2(0,0);
    const handleMouseMove = (e: MouseEvent) => {
        gsap.to(mouse, {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY / window.innerHeight) * 2 + 1,
            duration: 1.5,
            ease: 'power2.out'
        });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const handleResize = () => {
        const { innerWidth, innerHeight } = window;
        renderer.setSize(innerWidth, innerHeight);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      
      blobs.forEach(blob => blob.update(elapsedTime));

      gsap.to(scene.rotation, {
          x: -mouse.y * 0.1,
          y: -mouse.x * 0.1,
          duration: 2,
          ease: 'power3.out'
      })
      
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
        }
    }
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};
