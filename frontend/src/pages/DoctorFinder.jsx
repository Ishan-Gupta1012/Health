import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, ShieldCheck, Filter, ExternalLink, Briefcase, MapPin, BadgeIndianRupee, GraduationCap, Clock, Star, StarHalf, StarOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import DoctorCard from '../components/DoctorCard';
// Note: StarRating is no longer defined here, it's imported in DoctorCard

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
    // This initial fetch uses a local JSON file for mock/initial data.
    // To use the live backend API, you would replace this with:
    // const response = await apiService.doctors.find(selectedSpecialty, 'delhi');
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/data/doctors.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Use specialization or speciality, as per the data schema mapping in DoctorCard
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
    <div className="min-h-screen px-4 pt-24 sm:px-6 md:px-8">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
              <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="input pl-10 w-full" aria-label="Select a specialization" style={{ paddingLeft: '2.5rem' }}>
                <option value="">Filter by Specialization</option>
                {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="input pl-10 w-full" aria-label="Select a service" disabled={!availableServices.length} style={{ paddingLeft: '2.5rem' }}>
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
                    // DoctorCard uses the correct props from the updated component logic
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