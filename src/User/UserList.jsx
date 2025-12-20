import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Context } from '../Context_holder';

export default function StudentsList() {
  const { adminToken, notify, UsersFetch, UsersList } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    UsersFetch();
  }, []);

  useEffect(() => {
    if (UsersList?.length !== 0) setLoading(false);
  }, [UsersList]);

  const handleDelete = async (studentId) => {
    try {
      const Response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_URL}/delete/${studentId}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );

      notify(Response?.data.msg, Response?.data.status);
      if (Response?.data.status === 1) UsersFetch();
    } catch (err) {
      notify('Failed to delete student', 0);
    }
  };

  const confirmDelete = (studentId) => {
    setStudentToDelete(studentId);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      handleDelete(studentToDelete);
    }
    setShowModal(false);
    setStudentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setStudentToDelete(null);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    if (rating >= 2) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] p-6 md:p-12 text-[#F5DEB3] font-sans">
        <div className="max-w-6xl mx-auto bg-[#1A1A1A] p-8 border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)] rounded-3xl border border-[#333333] text-center">
          <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-lg">Loading Students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] p-6 md:p-12 text-[#F5DEB3] font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[#1A1A1A] p-8 border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)] rounded-3xl border border-[#333333] mb-8">
          <h2 className="text-4xl font-bold text-center text-[#FFD700] mb-2">
            📚 Students List
          </h2>
          <p className="text-center text-[#F5DEB3] opacity-80">
            Total Students: {UsersList?.length}
          </p>
        </div>

        {/* Students Table */}
        <div className="bg-[#1A1A1A] p-8 border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)] rounded-3xl border border-[#333333]">
          {UsersList?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#F5DEB3] text-lg opacity-80">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333333]">
                    <th className="text-left py-4 px-6 text-[#FFD700] font-semibold">Name</th>
                    <th className="text-left py-4 px-6 text-[#FFD700] font-semibold">Email</th>
                    <th className="text-left py-4 px-6 text-[#FFD700] font-semibold">Phone</th>
                    <th className="text-left py-4 px-6 text-[#FFD700] font-semibold">Rating</th>
                    <th className="text-left py-4 px-6 text-[#FFD700] font-semibold">Joined</th>
                    <th className="text-left py-4 px-6 text-[#FFD700] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {UsersList?.map((student, index) => (
                    <tr 
                      key={student._id} 
                      className={`border-b border-[#333333] hover:bg-[#0C0C0C]/50 transition-colors ${
                        index % 2 === 0 ? 'bg-[#0C0C0C]/30' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#FFD700] to-[#b8860b] rounded-full flex items-center justify-center text-black font-bold">
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[#F5DEB3] font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#F5DEB3]">{student.email}</td>
                      <td className="py-4 px-6 text-[#F5DEB3]">
                        {student.phone || 'Not provided'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${getRatingColor(student.rating)}`}>
                          ⭐ {student.rating || 0}/5
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#F5DEB3]">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => confirmDelete(student?._id)}
                          className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A52] text-white font-semibold px-4 py-2 rounded-full hover:brightness-110 transition shadow-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Custom Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#333333] shadow-[0_8px_24px_rgba(184,134,11,0.4)] max-w-md w-full">
              <h3 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">
                Confirm Deletion
              </h3>
              <p className="text-[#F5DEB3] text-center mb-6">
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A52] text-white font-semibold px-6 py-2 rounded-full hover:brightness-110 transition shadow-lg"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="bg-gradient-to-r from-[#FFD700] to-[#b8860b] text-black font-semibold px-6 py-2 rounded-full hover:brightness-110 transition shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-6 text-center text-[#F5DEB3] opacity-70">
          <p>Manage your students efficiently with this dashboard</p>
        </div>
      </div>
    </div>
  );
}