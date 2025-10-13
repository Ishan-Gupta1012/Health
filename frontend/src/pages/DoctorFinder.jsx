import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, ShieldCheck, Filter, ExternalLink, Briefcase, MapPin, BadgeIndianRupee, GraduationCap, Clock, Star, StarHalf, StarOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

// --- StarRating Component (Included in this file to prevent import errors) ---
const StarRating = ({ rating }) => {
  const numericRating = parseFloat(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const halfStar = numericRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  if (numericRating <= 0) {
    return (
      <div className="flex items-center text-gray-400">
        <StarOff size={16} className="mr-2" />
        <span className="text-xs font-medium">No Rating Available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={16} className="text-yellow-400 fill-current" />
      ))}
      {halfStar && <StarHalf size={16} className="text-yellow-400 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={16} className="text-gray-300 fill-current" />
      ))}
      <span className="ml-2 text-sm font-medium text-black/70">{numericRating.toFixed(1)}</span>
    </div>
  );
};

// --- DoctorCard Component (Included in this file to prevent import errors) ---
const DoctorCard = ({ doctor, index }) => {
  // --- FIX: Correctly access and format all complex and varying data fields ---
  const doctorName = doctor.doctorName || doctor.name || 'N/A';
  const speciality = doctor.speciality || doctor.specialization || 'Specialist';
  const clinicName = doctor.clinicName || (doctor.practice && doctor.practice.name) || 'Clinic details not available';
  const consultationFee = doctor.fees && typeof doctor.fees.amount !== 'undefined' ? doctor.fees.amount : 'N/A';
  const qualifications = doctor.qualifications && Array.isArray(doctor.qualifications)
    ? doctor.qualifications.map(q => q.degree).join(', ')
    : 'N/A';
  const address = doctor.address || (doctor.practice && doctor.practice.address && doctor.practice.address.locality) || doctor.location || 'Location not specified';
  const websiteUrl = doctor.website || doctor.profileUrl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 120 }}
      className="glass-card p-6 flex flex-col text-left space-y-4 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
    >
      <div>
        <h3 className="text-2xl font-bold text-black">{doctorName}</h3>
        <p className="text-blue-600 font-semibold">{speciality}</p>
      </div>
      <div className="text-sm space-y-3 text-black/80">
        <p className="flex items-start"><Briefcase size={16} className="mr-3 mt-0.5 flex-shrink-0 text-black/50" /><span>{doctor.experience} Years Experience</span></p>
        <p className="flex items-start"><GraduationCap size={16} className="mr-3 mt-0.5 flex-shrink-0 text-black/50" /><span>{qualifications}</span></p>
        <p className="flex items-start"><MapPin size={16} className="mr-3 mt-0.5 flex-shrink-0 text-black/50" /><span><strong>{clinicName}</strong>, {address}</span></p>
        <p className="flex items-center"><BadgeIndianRupee size={16} className="mr-3 flex-shrink-0 text-black/50" /><span>₹{consultationFee} Consultation Fee</span></p>
        <p className="flex items-center"><Clock size={16} className="mr-3 flex-shrink-0 text-black/50" /><span>{doctor.timings}</span></p>
      </div>
      <div className="pt-2">
        <StarRating rating={doctor.rating} />
      </div>
      <div className="flex-grow"></div>
      {websiteUrl && (
        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-4 inline-flex items-center justify-center" aria-label={`Visit clinic website for ${doctorName}`}>
          Visit Clinic <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      )}
    </motion.div>
  );
};

// --- Main DoctorFinder Component ---
const DoctorFinder = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/data/doctors.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const uniqueSpecialties = [...new Set(data.map(doc => doc.speciality || doc.specialization).filter(Boolean))];
        const allUniqueServices = [...new Set(data.flatMap(doc => doc.services || []).filter(Boolean))];
        setAllDoctors(data);
        setSpecializations(uniqueSpecialties.sort());
        setAvailableServices(allUniqueServices.sort());
      } catch (error) {
        console.error("Failed to fetch or parse doctor data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) {
      const doctorsInSpecialty = allDoctors.filter(doc => (doc.speciality || doc.specialization) === selectedSpecialty);
      const servicesInSpecialty = [...new Set(doctorsInSpecialty.flatMap(doc => doc.services || []).filter(Boolean))];
      setAvailableServices(servicesInSpecialty.sort());
      setSelectedService('');
    } else {
      const allUniqueServices = [...new Set(allDoctors.flatMap(doc => doc.services || []).filter(Boolean))];
      setAvailableServices(allUniqueServices.sort());
    }
  }, [selectedSpecialty, allDoctors]);

  useEffect(() => {
    if (!selectedSpecialty && !selectedService) {
      setFilteredDoctors([]);
      return;
    }
    let results = allDoctors;
    if (selectedSpecialty) {
      results = results.filter(doc => (doc.speciality || doc.specialization) === selectedSpecialty);
    }
    if (selectedService) {
      results = results.filter(doc => doc.services && doc.services.includes(selectedService));
    }
    setFilteredDoctors(results);
  }, [selectedSpecialty, selectedService, allDoctors]);

  return (
    // --- FIX: Added responsive padding to prevent overlap on mobile ---
    <div className="min-h-screen px-4 pt-24 sm:px-6 md:px-8">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // --- FIX: Increased bottom margin for more space ---
          className="text-center mb-10 md:mb-12"
        >
          <Filter className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-black/80" />
          <h1 className="text-3xl sm:text-4xl font-bold text-black mt-4">Find Your Doctor</h1>
          <p className="text-black/80 mt-2 max-w-lg mx-auto">Filter by specialization and services to find the right specialist for you.</p>
        </motion.div>

        <div className="glass-card max-w-4xl mx-auto p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
              <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="input pl-10 w-full" aria-label="Select a specialization">
                <option value="">Filter by Specialization</option>
                {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="input pl-10 w-full" aria-label="Select a service" disabled={!availableServices.length}>
                <option value="">Filter by Service</option>
                {availableServices.map(serv => <option key={serv} value={serv}>{serv}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <AnimatePresence>
              {filteredDoctors.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredDoctors.map((doc, index) => (
                    <DoctorCard key={`${doc.doctorName || doc.name}-${index}`} doctor={doc} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-12">
                  <p className="text-black/70 text-lg">
                    {selectedService || selectedSpecialty
                      ? "No doctors found for this selection. Please try another filter."
                      : "Please select a specialization or service to see results."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorFinder;