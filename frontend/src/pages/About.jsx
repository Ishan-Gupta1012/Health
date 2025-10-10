import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen text-black">
       <div className="wave"></div>
       <div className="wave"></div>
       <div className="wave"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            About <span className="gradient-text">HealthNest</span>
          </h1>
          <p className="text-lg md:text-xl text-black/80 max-w-3xl mx-auto">
            Empowering individuals with AI-driven tools for preventive care, fostering better patient-doctor connections, and making healthcare management seamless and accessible for everyone.
          </p>
        </motion.div>

        <motion.div 
            className="mt-16 md:mt-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 text-center">
              <Heart className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-black/80">To make proactive healthcare a simple, intuitive part of everyday life for everyone.</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Target className="h-10 w-10 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-black/80">A world where technology bridges the gap between patients and healthcare, leading to better health outcomes.</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Our Team</h3>
              <p className="text-black/80">A passionate group of developers, designers, and healthcare enthusiasts dedicated to innovation.</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Shield className="h-10 w-10 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">Our Promise</h3>
              <p className="text-black/80">To always prioritize your privacy and the security of your health data with the highest standards.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
