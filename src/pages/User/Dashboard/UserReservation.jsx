import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import config from '../../../config';
import axios from 'axios';
import BookingDetailsDrawer from '../../../components/user/BookingDetailsDrawer';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userReservationTranslations } from './translation/userReservationTranslations';

const TABS = ['All', 'Upcoming', 'Past', 'Cancel'];

// --- Status Styles ---
const STATUS_STYLES = {
  pending: 'text-yellow-700 bg-yellow-100',
  accepted: 'text-blue-700 bg-blue-100',
  completed: 'text-gray-700 bg-gray-200',
  cancelled: 'text-red-700 bg-red-100',
};

// --- Reservation Item Component ---
const ReservationItem = ({ reservation, onSelectReservation, createChat, t }) => (
  <div className="py-4 border-b border-gray-200 last:border-b-0">
    <div className="flex items-start space-x-4">
      <img
        src={reservation.trailerId?.images[0]}
        alt={reservation.trailerId?.title}
        className="w-32 h-20 sm:w-40 sm:h-24 object-cover rounded-lg flex-shrink-0"
      />
      <div className='flex-1'>
        <p className="font-bold text-gray-900 text-lg leading-tight mb-1">{reservation.trailerId?.title}</p>

        <div className="flex items-center text-sm text-gray-600 mb-1">
          <FaUser className="w-3.5 h-3.5 mr-1 text-red-600" />
          <span className="font-medium">{reservation.owner_id?.name}</span>
        </div>

        <p className="text-sm text-gray-500 mb-1">{[reservation.trailerId?.country, reservation.trailerId?.city].filter(i => i !== null).join(", ")}</p>
        <p className="text-sm text-gray-700 font-medium mb-2">{[reservation.startDate, reservation?.endDate].filter(i => i !== null).join(", ")}</p>

        <div className='flex justify-between flex-wrap items-center flex-1'>
          <span className={`text-xs font-medium px-2 py-1 rounded-md w-fit ${STATUS_STYLES[reservation.status] || 'text-gray-700 bg-gray-100'}`}>
            {reservation.status}
          </span>

          <div className="block sm:flex items-center justify-center gap-x-5">
            <button onClick={() => onSelectReservation(reservation)} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-150 cursor-pointer">
              {t.viewDetails}
            </button>
            <button onClick={() => createChat(reservation?.owner_id?._id)} className="sm:mt-0 t:3 bg-blue-50 border border-blue-300 text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-150 shadow-sm">
              {t.contactOwner}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const UserReservation = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [t, setT] = useState(() => {
    const lang = localStorage.getItem("lang") || "fr";
    return userReservationTranslations[lang] || userReservationTranslations.fr;
  });

  const nav = useNavigate();

  const filteredReservations = bookings.filter((booking) => {
    const today = new Date();
    switch (activeTab) {
      case 'All':
        return true;
      case 'Upcoming':
        return new Date(booking.startDate) >= today && booking.status !== 'cancelled';
      case 'Past':
        return new Date(booking.endDate) < today || booking.status === 'completed';
      case 'Cancel':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const createChat = async (ownerId) => {
    try {
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId || !ownerId) return;

      const response = await axios.post(`${config.baseUrl}/chat/create`, {
        participants: [currentUserId, ownerId]
      });

      nav(`/user/dashboard/messaging`);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const result = await axios.get(`${config.baseUrl}/booking/buyer/${localStorage.getItem("userId")}`);
      setBookings(result.data.data);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();

    // Handle language changes dynamically
    const handleLangChange = () => {
      const lang = localStorage.getItem("lang") || "fr";
      setT(userReservationTranslations[lang] || userReservationTranslations.fr);
    };

    window.addEventListener("storage", handleLangChange);
    handleLangChange();

    return () => window.removeEventListener("storage", handleLangChange);
  }, []);

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{t.myReservations}</h1>

      {/* All Reservations Container */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-800">{t.allReservations}</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5 overflow-x-auto">
          {t.tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(TABS[idx])}
              className={`px-4 py-3 text-sm font-medium transition duration-150 ease-in-out
                ${activeTab === TABS[idx]
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Reservation List */}
        <div className="p-5">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                reservation={reservation}
                onSelectReservation={setSelectedReservation}
                createChat={createChat}
                t={t}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t.noReservations.replace("{tab}", activeTab.toLowerCase())}
            </div>
          )}
        </div>
      </div>

      <BookingDetailsDrawer
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        StatusBadge={({ status }) => (
          <span className={`text-xs font-medium px-2 py-1 rounded-md w-fit ${STATUS_STYLES[status] || 'text-gray-700 bg-gray-100'}`}>
            {status}
          </span>
        )}
      />
    </div>
  );
};

export default UserReservation;
