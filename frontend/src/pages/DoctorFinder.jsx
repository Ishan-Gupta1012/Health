import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const DoctorFinder = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockDoctors = [
    {
      name: "Dr. Emily Carter",
      specialty: "Cardiology",
      address: "123 Health St, Anytown, USA",
      availability: "Available Today",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "Dr. Robert Harris",
      specialty: "Pediatrics",
      address: "456 Wellness Ave, Anytown, USA",
      availability: "Available Tomorrow",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      name: "Dr. Olivia Bennett",
      specialty: "Dermatology",
      address: "789 Skin Care Ln, Anytown, USA",
      availability: "Available Today",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDoctors(mockDoctors);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
              <input type="text" placeholder="Search by city or pincode" className="input pl-10" />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-grow">
                    <select className="input appearance-none w-full">
                        <option>Specialization</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
                </div>
                <div className="relative flex-grow">
                     <select className="input appearance-none w-full">
                        <option>Availability</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
                </div>
                 <div className="relative flex-grow">
                     <select className="input appearance-none w-full">
                        <option>Ratings</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
                </div>
            </div>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-black mb-6">Doctors near you</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              {doctors.map((doctor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img src={doctor.avatar} alt={doctor.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="font-bold text-black">{doctor.name}</h3>
                      <p className="text-sm text-black/80">{doctor.specialty}</p>
                      <p className="text-xs text-black/60">{doctor.address}</p>
                      <p className="text-xs text-green-800 font-semibold mt-1">{doctor.availability}</p>
                    </div>
                  </div>
                  <button className="btn-primary">Book Now</button>
                </motion.div>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 rounded-xl overflow-hidden glass-card"
            >
              <img src="https://i.imgur.com/8V2aV3m.png" alt="Map of doctors near you" className="w-full h-full object-cover"/>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorFinder;
