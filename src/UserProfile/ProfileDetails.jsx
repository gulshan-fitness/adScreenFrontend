import React, { useContext } from 'react';
import { Context } from '../Context_holder';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaStore } from 'react-icons/fa';

const ProfileDetails = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const userData = user;
  const userRole = userData?.role || 'advertiser';

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 relative">
        <button
          className="absolute top-4 right-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
          onClick={() => navigate("/edituserprofile")}
        >
          Edit
        </button>

        <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm lg:text-base">
              {userData?.name}
            </div>
          </div>
          {/* ... rest of profile fields */}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;