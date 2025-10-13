import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Search, BarChart3, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay }}
      className="glass-card p-8 text-center flex flex-col items-center"
    >
      <div className="bg-white/30 p-4 rounded-full mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-black mb-3">{title}</h3>
      <p className="text-black/70 flex-grow">{description}</p>
      {/* Updated link color to match the new darker theme */}
      <Link to="/" className="mt-6 font-semibold text-[#004D61] hover:text-[#002D38] transition-colors flex items-center">
        Learn More <ChevronRight size={20} className="ml-1" />
      </Link>
    </motion.div>
  );
};

const Home = () => {
  const features = [
    {
      icon: <BrainCircuit size={32} className="text-[#8E78FF]" />,
      title: "AI Symptom Assistant",
      description: "Get intelligent insights into your symptoms with our advanced AI-powered checker.",
      delay: 0.1,
    },
    {
      icon: <Search size={32} className="text-[#38A3A5]" />,
      title: "Doctor Finder",
      description: "Easily find and connect with top-rated doctors and specialists in your area.",
      delay: 0.3,
    },
    {
      icon: <BarChart3 size={32} className="text-[#56ABF1]" />,
      title: "Health Insights",
      description: "Track your medical records and gain personal health insights to manage your well-being.",
      delay: 0.5,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* These existing waves are PRESERVED */}
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10"
        >
          {/* This heading will now use the new darker iridescent-text class */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
            <span className="iridescent-text">Smart.</span>{' '}
            <span className="iridescent-text">Personal.</span>{' '}
            <span className="iridescent-text">Natural.</span>
            <br />
            Your All-in-One Health Companion.
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-black/60">
            Bringing simplicity, care, and AI-powered health to your fingertips.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* These buttons will now use the new darker frosted glass styles */}
            <Link to="/symptom-checker" className="btn-primary">Get Started</Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black">A Smarter Way to Manage Your Health</h2>
            <p className="mt-4 text-lg text-black/60 max-w-2xl mx-auto">
              HealthNest integrates modern technology with personal care to provide a seamless health experience.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;