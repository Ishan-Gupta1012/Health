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
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' }
  ];

  return (
    <footer className="bg-black/20 text-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HealthNest</span>
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              Your trusted companion for comprehensive health management.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg bg-white/10 hover:bg-green-500 transition-colors duration-200"
                  aria-label={social.name}
                  data-testid={`social-${social.name.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links?.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-white/70 hover:text-green-300 transition-colors duration-200"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">
              © {currentYear} HealthNest. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-white/70 hover:text-green-300 text-sm transition-colors duration-200" data-testid="privacy-policy-link">
                Privacy Policy
              </Link>
              <Link to="#" className="text-white/70 hover:text-green-300 text-sm transition-colors duration-200" data-testid="terms-service-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;