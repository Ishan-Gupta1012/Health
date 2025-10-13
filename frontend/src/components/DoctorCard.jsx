import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Briefcase, MapPin, BadgeIndianRupee, GraduationCap, Clock } from 'lucide-react';
import StarRating from './StarRating';

const DoctorCard = ({ doctor, index }) => {
  // --- Data Parsing and Fallbacks to prevent runtime errors ---

  // Handles both `doctorName` and `name` properties.
  const doctorName = doctor.doctorName || doctor.name || 'N/A';
  
  // Handles both `speciality` and `specialization` properties.
  const speciality = doctor.speciality || doctor.specialization || 'Specialist';
  
  // Handles both `clinicName` and `practice.name` properties.
  const clinicName = doctor.clinicName || (doctor.practice && doctor.practice.name) || 'Clinic details not available';

  // Handles `fees` object: { amount: 500, currency: 'INR' }. Accesses `amount`.
  const consultationFee = doctor.fees && typeof doctor.fees.amount !== 'undefined' ? doctor.fees.amount : 'N/A';

  // Handles `qualifications` array of objects: [{ degree: 'MBBS' }, ...]. Joins the degrees.
  const qualifications = doctor.qualifications && Array.isArray(doctor.qualifications)
    ? doctor.qualifications.map(q => q.degree).join(', ')
    : 'N/A';

  // Handles `address` which can be a string or nested.
  const address = doctor.address || (doctor.practice && doctor.practice.address && doctor.practice.address.locality) || doctor.location || 'Location not specified';
  
  // Handles both `website` and `profileUrl` for the link.
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
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full mt-4 inline-flex items-center justify-center"
            aria-label={`Visit clinic website for ${doctorName}`}
          >
            Visit Clinic <ExternalLink className="h-4 w-4 ml-2" />
          </a>
      )}
    </motion.div>
  );
};

export default DoctorCard;
