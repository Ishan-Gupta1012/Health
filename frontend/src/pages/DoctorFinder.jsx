import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Phone, Mail, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const DoctorFinder = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    specialty: '',
    city: '',
    state: '',
    rating: ''
  });

  // Mock doctors data
  const mockDoctors = [
    {
      doctorId: '1',
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      qualification: "MD, FACC",
      experience: 12,
      location: { address: "123 Medical Center Drive", city: "New York", state: "NY" },
      contact: { phone: "+1-555-0123", email: "sarah.johnson@healthcenter.com" },
      rating: 4.8,
      reviewCount: 156,
      consultationFee: 200,
      availability: { days: ["Monday", "Tuesday", "Wednesday"], hours: { start: "09:00", end: "17:00" } }
    },
    {
      doctorId: '2',
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      qualification: "MD, Board Certified",
      experience: 8,
      location: { address: "456 Health Plaza", city: "Los Angeles", state: "CA" },
      contact: { phone: "+1-555-0124", email: "michael.chen@skincare.com" },
      rating: 4.6,
      reviewCount: 89,
      consultationFee: 180,
      availability: { days: ["Monday", "Wednesday", "Friday"], hours: { start: "10:00", end: "18:00" } }
    }
  ];

  useEffect(() => {
    setDoctors(mockDoctors);
  }, []);

  const searchDoctors = () => {
    setLoading(true);
    // Mock search with delay
    setTimeout(() => {
      setDoctors(mockDoctors);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Doctors</h1>
          <p className="text-xl text-gray-600">Discover qualified healthcare professionals near you</p>
        </motion.div>

        {/* Search Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Specialty"
              value={searchFilters.specialty}
              onChange={(e) => setSearchFilters({...searchFilters, specialty: e.target.value})}
              className="input"
              data-testid="specialty-search"
            />
            <input
              type="text"
              placeholder="City"
              value={searchFilters.city}
              onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
              className="input"
              data-testid="city-search"
            />
            <input
              type="text"
              placeholder="State"
              value={searchFilters.state}
              onChange={(e) => setSearchFilters({...searchFilters, state: e.target.value})}
              className="input"
              data-testid="state-search"
            />
            <button
              onClick={searchDoctors}
              className="btn-primary"
              data-testid="search-doctors-btn"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="grid gap-6" data-testid="doctors-list">
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.doctorId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{doctor.name}</h3>
                    <p className="text-primary-600 font-medium mb-2">{doctor.specialty}</p>
                    <p className="text-gray-600 mb-2">{doctor.qualification}</p>
                    <div className="flex items-center mb-4">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-600 text-sm">
                        {doctor.location.city}, {doctor.location.state}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{doctor.rating} ({doctor.reviewCount} reviews)</span>
                      </div>
                      <div>{doctor.experience} years exp.</div>
                      <div>${doctor.consultationFee} consultation</div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button className="btn-primary w-full lg:w-auto" data-testid={`book-${doctor.doctorId}`}>
                      Book Appointment
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorFinder;