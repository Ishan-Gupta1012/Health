import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Stethoscope, 
  Search, 
  Calendar, 
  FileText,
  ArrowRight
} from 'lucide-react';
import useAuthHook from '../hooks/useAuth';

const FeatureCard = ({ icon: Icon, title, description, linkTo }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card h-full flex flex-col p-6"
    >
      <div className="w-12 h-12 bg-black/20 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-black" />
      </div>
      <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
      <p className="text-black/80 mb-4 leading-relaxed flex-grow">{description}</p>
      <Link
        to={linkTo}
        className="inline-flex items-center text-blue-600 hover:text-black font-medium transition-colors mt-auto"
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
      description: "Enter your symptoms and get AI-powered insights on possible causes.",
      linkTo: "/symptom-checker"
    },
    {
      icon: Search,
      title: "Doctor Finder",
      description: "Find verified doctors and specialists near you. Filter by specialty and distance.",
      linkTo: "/doctor-finder"
    },
    {
      icon: Calendar,
      title: "Medicine Reminders",
      description: "Set reminders for your medications and never miss a dose.",
      linkTo: user ? "/medicine-reminders" : "/signin"
    },
    {
      icon: FileText,
      title: "Medical Record Sharing",
      description: "Securely share your medical records with healthcare providers.",
      linkTo: user ? "/medical-records" : "/signin"
    }
  ];

  return (
    <div className="min-h-screen text-black">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Your Unified Smart Health Assistant
            </h1>
            <p className="text-xl lg:text-2xl text-black/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-3"
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
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">A Suite of Smart Health Tools</h2>
            <p className="text-xl text-black/80 max-w-3xl mx-auto">
              From checking your symptoms to managing your health records, HealthNest has you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;