import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, HeartPulse, Calendar, FileText, Utensils, ArrowRight, Lightbulb } from 'lucide-react';
import HealthMateChatbot from '../components/HealthMateChatbot';
import * as THREE from 'three';
import { gsap } from 'gsap';

// --- New Three.js Animated Background (Updated with continuous background color change) ---
const AnimatedBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Set alpha to false as we now control the background via the renderer's clear color
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        // Background colors for the transition
        const bgColors = [
            new THREE.Color('#e0f2f1'), // Light Mint
            new THREE.Color('#ffebee'), // Light Pink
            new THREE.Color('#e3f2fd')  // Light Blue
        ];
        renderer.setClearColor(bgColors[0]);

        // Particle creation
        const particleCount = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const palette = [
            new THREE.Color('#98FF98'), // Mint Green
            new THREE.Color('#FFB6C1'), // Light Pink
            new THREE.Color('#FFFFFF')  // White
        ];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.025,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        // Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Animate background color
            const transitionSpeed = 0.1;
            const colorProgress = (elapsedTime * transitionSpeed) % bgColors.length;
            const currentColorIndex = Math.floor(colorProgress);
            const nextColorIndex = (currentColorIndex + 1) % bgColors.length;
            const lerpFactor = colorProgress - currentColorIndex;

            const currentColor = bgColors[currentColorIndex];
            const nextColor = bgColors[nextColorIndex];

            const interpolatedColor = new THREE.Color().copy(currentColor).lerp(nextColor, lerpFactor);
            renderer.setClearColor(interpolatedColor);

            // Animate particles
            particles.rotation.y = elapsedTime * 0.1;
            particles.rotation.x = elapsedTime * 0.05;

            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', onResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            if (mount && renderer.domElement) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    // Tailwind background class is removed as Three.js now controls the color
    return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};


// --- Predefined list of daily wellness tips ---
const wellnessTips = [
    "🧘‍♀️ Try stretching for 10 minutes after breakfast to improve digestion.",
    "🍎 Include one fruit before lunch for better vitamin absorption.",
    "💧 Drink a glass of water before your first meal to kickstart hydration.",
    "💤 Take a 5-minute break from screens every hour to reduce eye strain.",
    "🚶‍♂️ Walk for 10 minutes after lunch to aid digestion.",
    "🥗 Add one extra serving of vegetables to your dinner.",
    "😌 Practice 3 deep breaths in the morning to start your day relaxed.",
    "🍵 Enjoy a cup of green tea in the afternoon for a gentle energy boost.",
    "📝 Write down one thing you’re grateful for each morning.",
    "🔔 Set a reminder to stand up every hour for better posture and circulation."
];

const features = [
    {
        icon: <Stethoscope size={32} className="text-primary" />,
        title: "Symptom Checker",
        description: "Analyze your symptoms and get potential insights.",
        link: "/symptom-checker",
        color: "from-blue-100/80 to-blue-200/80"
    },
    {
        icon: <HeartPulse size={32} className="text-primary" />,
        title: "Find a Doctor",
        description: "Locate doctors and specialists near you.",
        link: "/doctor-finder",
        color: "from-green-100/80 to-green-200/80"
    },
    {
        icon: <Utensils size={32} className="text-primary" />,
        title: "Meal Tracker",
        description: "Log your meals and track your nutrition.",
        link: "/meal-tracker",
        color: "from-yellow-100/80 to-yellow-200/80"
    },
];

const FeatureCard = ({ icon, title, description, link, color }) => (
    <Link to={link} className="flex-shrink-0 w-72 mx-4">
        <div className={`relative p-6 bg-gradient-to-br ${color} rounded-2xl shadow-lg h-full flex flex-col justify-between overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl backdrop-blur-sm border border-white/30`}>
            <div>
                <div className="mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
                <p className="text-sm text-neutral-600 mt-1">{description}</p>
            </div>
            <div className="flex justify-end items-center mt-4">
                <p className="text-sm font-semibold text-primary">Explore</p>
                <ArrowRight size={16} className="ml-1 text-primary" />
            </div>
        </div>
    </Link>
);

const Home = () => {
    const [dailyTip, setDailyTip] = useState('');

    useEffect(() => {
        const updateTip = () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 0);
            const diff = now - start;
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);
            const tipIndex = dayOfYear % wellnessTips.length;
            setDailyTip(wellnessTips[tipIndex]);
        };

        updateTip();
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const msUntilMidnight = midnight.getTime() - now.getTime();
        const timerId = setTimeout(updateTip, msUntilMidnight);
        return () => clearTimeout(timerId);
    }, []);

    return (
        <div className="relative min-h-screen text-neutral-800 overflow-hidden">
            <AnimatedBackground />
            
            {/* Content Wrapper */}
            <div className="relative z-10">
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center py-20 px-4"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-900">
                        Your Personal <span className="text-primary">Health</span> Companion
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600">
                        Track, manage, and improve your well-being with our integrated suite of health tools.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/symptom-checker" className="px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition-colors">
                            Get Started
                        </Link>
                        <Link to="/about" className="px-6 py-3 bg-white/70 backdrop-blur-sm text-neutral-800 font-semibold rounded-full hover:bg-white transition-colors border border-white/50">
                            Learn More
                        </Link>
                    </div>
                </motion.div>

                {/* Continuous Scrolling Features Section */}
                <div className="py-16">
                    <h2 className="text-3xl font-bold text-center mb-10 text-neutral-900">Explore Our Features</h2>
                    <div className="max-w-6xl mx-auto">
                        <div 
                          className="relative w-full overflow-hidden group"
                          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
                        >
                            <div className="flex animate-scroll group-hover:pause">
                                {[...features, ...features].map((feature, index) => (
                                    <FeatureCard key={`${feature.title}-${index}`} {...feature} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Health Insight Section */}
                <div className="py-16 bg-white/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center px-4"
                    >
                        <div className="inline-block bg-primary-light/50 p-3 rounded-full mb-4">
                            <Lightbulb className="text-primary-dark" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900">Today’s Health Insight</h2>
                        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
                            {dailyTip}
                        </p>
                    </motion.div>
                </div>
            </div>

            <HealthMateChatbot />
        </div>
    );
};

export default Home;

    