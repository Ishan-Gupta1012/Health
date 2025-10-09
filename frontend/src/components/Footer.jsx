import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'HealthNest',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Our Mission', href: '#' },
        { name: 'Healthcare Partners', href: '#' },
        { name: 'Careers', href: '#' }
      ]
    },
    {
      title: 'Features',
      links: [
        { name: 'Symptom Checker', href: '/symptom-checker' },
        { name: 'Doctor Finder', href: '/doctor-finder' },
        { name: 'Medicine Reminders', href: '/medicine-reminders' },
        { name: 'Medical Records', href: '/medical-records' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Contact Us', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' }
      ]
    },
    {
      title: 'Contact',
      items: [
        { icon: Mail, text: 'support@healthnest.com' },
        { icon: Phone, text: '+1 (555) 123-4567' },
        { icon: MapPin, text: 'San Francisco, CA' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HealthNest</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted companion for comprehensive health management. 
              Empowering you with smart tools for better healthcare decisions.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors duration-200"
                  aria-label={social.name}
                  data-testid={`social-${social.name.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links && section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                {section.items && section.items.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-gray-400">
                    <item.icon className="h-4 w-4 text-primary-400" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="stat-patients">
              <div className="text-3xl font-bold text-primary-400 mb-2">100K+</div>
              <div className="text-gray-400">Patients Helped</div>
            </div>
            <div className="text-center" data-testid="stat-doctors">
              <div className="text-3xl font-bold text-primary-400 mb-2">500+</div>
              <div className="text-gray-400">Verified Doctors</div>
            </div>
            <div className="text-center" data-testid="stat-cities">
              <div className="text-3xl font-bold text-primary-400 mb-2">50+</div>
              <div className="text-gray-400">Cities Covered</div>
            </div>
            <div className="text-center" data-testid="stat-satisfaction">
              <div className="text-3xl font-bold text-primary-400 mb-2">4.9★</div>
              <div className="text-gray-400">User Rating</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} HealthNest. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link 
                to="#" 
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
                data-testid="privacy-policy-link"
              >
                Privacy Policy
              </Link>
              <Link 
                to="#" 
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
                data-testid="terms-service-link"
              >
                Terms of Service
              </Link>
              <Link 
                to="#" 
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
                data-testid="cookie-policy-link"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            <strong>Medical Disclaimer:</strong> HealthNest is not a substitute for professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
            with any questions you may have regarding a medical condition. Never disregard professional medical 
            advice or delay in seeking it because of something you have read on HealthNest.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;