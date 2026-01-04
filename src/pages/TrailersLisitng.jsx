import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar2 from '../components/Navbar2';
import axios from 'axios';
import config from '../config';
import toast from 'react-hot-toast';
import { trailersListingTranslations } from '../translations/trailerListing';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import BookingModal from '../components/BookingModel';

const GOOGLE_API_KEY = config.GOOGLE_API_KEY;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, type: 'spring' },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const selectStyle = "bg-[#F1F1F1] p-2 rounded-md";
const containerStyle = { width: "100%", height: "100%" };

const useQuery = () => new URLSearchParams(useLocation().search);

const createTruckMarker = (price) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="20">
      <rect x="0" y="0" width="70" height="20" rx="10" ry="10" fill="#2563eb" />
      <text x="35" y="14" font-size="10" text-anchor="middle" fill="white" font-family="Arial">
        $${price}
      </text>
    </svg>
  `;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};

const TrailersListing = () => {
  const nav = useNavigate();
  const query = useQuery();
  const cityFromQuery = query.get('city')?.toLowerCase() || '';
  const isLogin = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [priceFilter, setPriceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filteredTrailers, setFilteredTrailers] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTrailerForBooking, setSelectedTrailerForBooking] = useState(null);

  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return trailersListingTranslations[storedLang] || trailersListingTranslations.fr;
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem('lang');
      setTranslations(trailersListingTranslations[storedLang] || trailersListingTranslations.fr);
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCardClick = (id) => nav(`/trailers/${id}`);

  const handleBookNowClick = (e, trailer) => {
    e.stopPropagation();
    setSelectedTrailerForBooking(trailer);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTrailerForBooking(null);
  };

  const handleBookingSubmit = async ({ trailerId, startDate, endDate, price }) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not found");
      return;
    }

    let loadingToast = toast.loading("Redirecting to payment...");

    try {
      const { data } = await axios.post(`${config.baseUrl}/stripe/create-checkout-session`, {
        trailerId,
        userId,
        startDate,
        endDate,
        price,
      });

      toast.dismiss(loadingToast);

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (error) {
      toast.error("Payment failed", { id: loadingToast });
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTrailers(cityFromQuery);
  }, [cityFromQuery]);

  useEffect(() => {
    let filtered = [...trailers];
    if (priceFilter === 'lowToHigh') filtered.sort((a, b) => parseFloat(a.dailyRate) - parseFloat(b.dailyRate));
    else if (priceFilter === 'highToLow') filtered.sort((a, b) => parseFloat(b.dailyRate) - parseFloat(a.dailyRate));
    if (typeFilter) filtered = filtered.filter(t => t.category?.toLowerCase() === typeFilter.toLowerCase());
    if (keyword.trim()) filtered = filtered.filter(t =>
      t.title?.toLowerCase().includes(keyword.toLowerCase()) ||
      t.description?.toLowerCase().includes(keyword.toLowerCase())
    );
    if (sortBy === 'popular') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredTrailers(filtered);
  }, [priceFilter, typeFilter, keyword, sortBy, trailers]);

  const fetchTrailers = async (cityFilter) => {
    try {
      const res = await axios.get(`${config.baseUrl}/trailer/all/approved`);
      let allTrailers = res.data.data || [];
      if (cityFilter) {
        allTrailers = allTrailers.filter((t) => {
          const fullLocation = `${t.city || ''}, ${t.state || ''}`.toLowerCase();
          return t.city?.toLowerCase().includes(cityFilter) || t.state?.toLowerCase().includes(cityFilter) || fullLocation.includes(cityFilter);
        });
      }
      setTrailers(allTrailers);
    } catch (err) {
      console.error(err);
      toast.error(translations.failedToFetch);
    }
  };

  const DEFAULT_CENTER = {
    lat: 45.5017,
    lng: -73.5673,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar2 />
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex flex-wrap gap-4">
                <select className={selectStyle} onChange={(e) => setPriceFilter(e.target.value)}>
                  <option value="">{translations.price}</option>
                  <option value="lowToHigh">{translations.lowToHigh}</option>
                  <option value="highToLow">{translations.highToLow}</option>
                </select>
                <select className={selectStyle} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="">{translations.type}</option>
                  <option value="Travel Trailer">{translations.travelTrailer}</option>
                  <option value="Toy Hauler">{translations.toyHauler}</option>
                </select>
                <input
                  type="text"
                  placeholder={translations.keywordSearch}
                  className={selectStyle}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className='flex justify-between items-center mb-6'>
              <h2 className="text-xl font-semibold text-gray-700">
                {trailers.length} {translations.trailersAvailable}
              </h2>
              <select className={selectStyle} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">{translations.popular}</option>
                <option value="popular">{translations.mostRecent}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTrailers.map((trailer, i) => (
                <motion.div
                  key={trailer._id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => handleCardClick(trailer._id)}
                >
                  <img
                    src={trailer.images?.[0] || `https://placehold.co/400x300/F3F4F6/9CA3AF?text=${encodeURIComponent(translations.noImage)}`}
                    alt={trailer.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{trailer.title}</h3>
                    {/* <p className="text-gray-600 text-sm mb-1">{trailer.userId?.email || translations.unknownOwner}</p> */}
                    <p className="text-gray-500 text-xs mb-2">{trailer.city}, {trailer.state}</p>
                    <div className='flex items-center justify-between'>
                      <p className="text-black font-medium text-lg">${trailer.dailyRate}{translations.perDay}</p>
                      {
                        (isLogin && role !== "owner") &&
                        <button
                          className='bg-blue-700 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-800 transition-colors'
                          onClick={(e) => handleBookNowClick(e, trailer)}
                        >
                          {translations.bookNow}
                        </button>
                      }
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3 flex-shrink-0 h-[80vh]">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={
                  trailers.length > 0
                    ? {
                      lat: parseFloat(trailers[0].latitude),
                      lng: parseFloat(trailers[0].longitude),
                    }
                    : DEFAULT_CENTER
                }
                zoom={10}
              >
                {trailers.map((trailer) => (
                  <Marker
                    key={trailer._id}
                    position={{ lat: parseFloat(trailer.latitude), lng: parseFloat(trailer.longitude) }}
                    onClick={() => setActiveTrailer(trailer)}
                    icon={{ url: createTruckMarker(trailer.dailyRate), scaledSize: new window.google.maps.Size(80, 50) }}
                  />
                ))}

                {activeTrailer && (
                  <InfoWindow
                    position={{ lat: parseFloat(activeTrailer.latitude), lng: parseFloat(activeTrailer.longitude) }}
                    onCloseClick={() => setActiveTrailer(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold">{activeTrailer.title}</h3>
                      <p>${activeTrailer.dailyRate}{translations.perDay}</p>
                      <p>{activeTrailer.city}, {activeTrailer.state}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>
        </div>

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          trailer={selectedTrailerForBooking}
          translations={translations}
          onSubmit={handleBookingSubmit}
        />

      </main>

      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
        <Footer />
      </motion.div>
    </div>
  );
};

export default TrailersListing;
