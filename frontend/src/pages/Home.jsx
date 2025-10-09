import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Stethoscope, 
  Search, 
  Calendar, 
  FileText,
  Upload,
  Share2,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import useAuthHook from '../hooks/useAuth';

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const FeatureCard = ({ icon: Icon, title, description, linkTo, color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    accent: "from-accent-400 to-accent-500",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <Link
        to={linkTo}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
        data-testid={`feature-link-${title.toLowerCase().replace(' ', '-')}`}
      >
        Explore <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </motion.div>
  );
};

const Home = () => {
  const { user } = useAuthHook();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/symptom-checker');
    } else {
      navigate('/signin');
    }
  };

  const features = [
    {
      icon: Stethoscope,
      title: "Symptom Checker",
      description: "Get instant insights about your symptoms with our intelligent health assessment tool.",
      linkTo: "/symptom-checker",
      color: "primary"
    },
    {
      icon: Search,
      title: "Find Doctors",
      description: "Discover qualified healthcare professionals near you with specialized expertise.",
      linkTo: "/doctor-finder",
      color: "accent"
    },
    {
      icon: Calendar,
      title: "Medicine Reminders",
      description: "Never miss a dose with smart medication tracking and personalized alerts.",
      linkTo: user ? "/medicine-reminders" : "/signin",
      color: "purple"
    },
    {
      icon: FileText,
      title: "Medical Records",
      description: "Securely store and share your health documents with healthcare providers.",
      linkTo: user ? "/medical-records" : "/signin",
      color: "orange"
    }
  ];

  const benefits = [
    { icon: Shield, title: "Secure & Private", description: "Your health data is protected with enterprise-grade security" },
    { icon: Clock, title: "24/7 Available", description: "Access your health tools anytime, anywhere" },
    { icon: Users, title: "Expert Network", description: "Connected to verified healthcare professionals" },
    { icon: Star, title: "Highly Rated", description: "Trusted by thousands of satisfied users" }
  ];

  const stats = [
    { number: 100000, label: "Patients Helped", suffix: "+" },
    { number: 500, label: "Verified Doctors", suffix: "+" },
    { number: 50, label: "Cities Covered", suffix: "+" },
    { number: 4.9, label: "User Rating", suffix: "★" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight mb-6">
              Your Unified Smart{' '}
              <span className="gradient-text">Health Assistant</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-3 neon-shadow-primary-hover"
                data-testid="get-started-btn"
              >
                Get Started
              </motion.button>
              <Link
                to="/doctor-finder"
                className="btn-secondary text-lg px-8 py-3"
                data-testid="learn-more-btn"
              >
                Learn More
              </Link>
            </div>

            {/* Stats Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              data-testid="stats-section"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                    {stat.number >= 100 ? (
                      <>
                        <AnimatedCounter end={stat.number} />
                        {stat.suffix}
                      </>
                    ) : (
                      `${stat.number}${stat.suffix}`
                    )}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Complete Health Management Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to take control of your health journey in one integrated platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose HealthNest?
            </h2>
            <p className="text-xl text-gray-600">
              Built with your health and privacy as our top priorities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust HealthNest for their healthcare needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200"
              data-testid="cta-get-started-btn"
            >
              Start Your Health Journey
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;