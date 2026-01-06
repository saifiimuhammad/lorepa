import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import config from '../../../config';
import BookingDetailsDrawer from '../../../components/buyer/BookingDetailsDrawer';
import toast from 'react-hot-toast';
import { reservationTranslations, statusTranslations } from './translation/reservationTranslations';

const STATUS_STYLES = {
    pending: 'text-yellow-700 bg-yellow-100',
    accepted: 'text-blue-700 bg-blue-100',
    completed: 'text-gray-700 bg-gray-200',
    cancelled: 'text-red-700 bg-red-100',
};

const TABS = ['All', 'Upcoming', 'Past', 'Cancel'];

const StatusBadge = ({ status, lang }) => (
    <span className={`text-xs font-medium px-2 py-1 rounded-md w-fit ${STATUS_STYLES[status] || 'text-gray-700 bg-gray-100'}`}>
        {statusTranslations[lang]?.[status] || status}
    </span>
);

const ReservationItem = ({ reservation, onSelectReservation, onChangeStatus, lang, t }) => {
    const handleStatusChange = async (newStatus) => {
        await onChangeStatus(reservation._id, newStatus);
    };

    return (
        <div className="py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition duration-150 rounded-lg p-2 -mx-2">
            <div className="flex items-start space-x-4">
                <img
                    src={reservation.trailerId?.images[0]}
                    alt={reservation.trailerId?.title}
                    className="w-32 h-20 sm:w-40 sm:h-24 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x96/A3A3A3/FFFFFF?text=TRAILER"; }}
                />
                <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg leading-tight mb-1">{reservation.trailerId?.title}</p>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FaUser className="w-3.5 h-3.5 mr-1 text-red-600" />
                        <span className="font-medium">{reservation.user_id?.name}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{[reservation.trailerId?.country, reservation.trailerId?.city].filter(Boolean).join(", ")}</p>
                    <p className="text-sm text-gray-700 font-medium mb-2">{[reservation.startDate, reservation?.endDate].filter(Boolean).join(", ")}</p>
                    <div className="flex justify-between flex-wrap items-center mt-3">
                        <StatusBadge status={reservation.status} lang={lang} />
                        <div className="flex items-center justify-center gap-x-2 mt-2 sm:mt-0">
                            <button onClick={() => onSelectReservation(reservation)} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-150 cursor-pointer">
                                {t.viewDetails}
                            </button>

                            {reservation.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleStatusChange('accepted')}
                                        className="bg-blue-600 border text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition duration-150"
                                    >
                                        {t.accept}
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('cancelled')}
                                        className="bg-blue-50 border border-blue-600 text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-150 shadow-sm"
                                    >
                                        {t.decline}
                                    </button>
                                </>
                            )}

                            {reservation.status === 'accepted' && (
                                <button
                                    onClick={() => handleStatusChange('completed')}
                                    className="bg-green-600 border text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition duration-150"
                                >
                                    {t.complete}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BuyerReservation = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');
    const t = reservationTranslations[lang];

    const filteredReservations = bookings.filter((booking) => {
        const today = new Date();
        switch (activeTab) {
            case 'All': return true;
            case 'Upcoming': return new Date(booking.startDate) >= today && booking.status !== 'cancelled';
            case 'Past': return new Date(booking.endDate) < today || booking.status === 'completed';
            case 'Cancel': return booking.status === 'cancelled';
            default: return true;
        }
    });

    const fetchBookings = async () => {
        try {
            const result = await axios.get(`${config.baseUrl}/booking/seller/${localStorage.getItem("userId")}`);
            setBookings(result.data.data);
        } catch (err) {
            toast.error(t.fetchError);
        }
    };

    const handleChangeStatus = async (id, status) => {
        try {
            await axios.put(`${config.baseUrl}/booking/status/${id}`, { status });
            fetchBookings();
            toast.success(t.updateSuccess.replace('{status}', statusTranslations[lang][status]));
        } catch (err) {
            toast.error(t.updateError);
        }
    };

    useEffect(() => {
        fetchBookings();
        const handleStorageChange = () => setLang(localStorage.getItem('lang') || 'fr');
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">{t.pageTitle}</h1>
            <div className="bg-white rounded-xl shadow-lg">
                <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800">{t.allReservations}</h2>
                </div>
                <div className="flex border-b border-gray-200 px-5 overflow-x-auto">
                    {t.tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-medium transition duration-150 ease-in-out ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="p-5">
                    {filteredReservations.length ? (
                        filteredReservations.map(reservation => (
                            <ReservationItem
                                key={reservation._id}
                                reservation={reservation}
                                onSelectReservation={setSelectedReservation}
                                onChangeStatus={handleChangeStatus}
                                lang={lang}
                                t={t}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {t.noReservations.replace('{tab}', activeTab)}
                        </div>
                    )}
                </div>
            </div>

            <BookingDetailsDrawer
                reservation={selectedReservation}
                onClose={() => setSelectedReservation(null)}
                StatusBadge={StatusBadge}
            />
        </div>
    );
};

export default BuyerReservation;
