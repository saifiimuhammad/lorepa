import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleDown, FaAngleUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import config from '../config';
import manImage from '../assets/dashboard/review1.jpg'
import manImage2 from '../assets/dashboard/review2.jpg'
import manImage3 from '../assets/dashboard/review3.jpg'
import { singleTrailerTranslations } from './singleTrailerTranslations';
import { trailersListingTranslations } from '../translations/trailerListing';
import toast from 'react-hot-toast';
import BookingModal from '../components/BookingModel';

const reviews = [
  {
    name: "Rodney Jean-Baptiste",
    rating: 5,
    timeAgo: {
      en: "1 week ago",
      es: "hace 1 semana",
      cn: "1 周前",
      fr: "il y a 1 semaine"
    },
    reviewText: {
      en: "It was my first time using Lorepa and I was very impressed! The host was extremely welcoming, showed me how to properly attach the trailer, and made sure everything was secure. Everything went smoothly, and communication was clear from start to finish. I’ll definitely book again through Lorepa without hesitation.",
      es: "¡Era la primera vez que usaba Lorepa y quedé muy impresionado! El anfitrión fue extremadamente acogedor, me mostró cómo sujetar correctamente el remolque y se aseguró de que todo estuviera seguro. Todo salió bien y la comunicación fue clara de principio a fin. Definitivamente volveré a reservar a través de Lorepa sin dudarlo.",
      cn: "这是我第一次使用Lorepa，印象非常深刻！房东非常热情，向我展示了如何正确连接拖车，并确保一切都安全。整个过程都很顺利，沟通从始至终都很清晰。我一定会毫不犹豫地再次通过Lorepa预订。",
      fr: "C'était ma première fois avec Lorepa et j'ai été très impressionné ! L'hôte a été extrêmement accueillant, m'a montré comment attacher correctement la remorque et s'est assuré que tout était sécurisé. Tout s'est bien passé et la communication a été claire du début à la fin. Je vais certainement réserver à nouveau via Lorepa sans hésitation."
    },
    avatar: manImage
  },
  {
    name: "Mathieu Beaulieu",
    rating: 5,
    timeAgo: {
      en: "4 days ago",
      es: "hace 4 días",
      cn: "4 天前",
      fr: "il y a 4 jours"
    },
    reviewText: {
      en: "Lorepa really made things easier for me! I needed a trailer at the last minute and was able to book one in just a few clicks. The host was very courteous and flexible with the schedule. The trailer was clean and sturdy, exactly what I needed. Great discovery — I’ll definitely rent again through Lorepa.",
      es: "¡Lorepa realmente me hizo las cosas más fáciles! Necesitaba un remolque a última hora y pude reservar uno con solo unos pocos clics. El anfitrión fue muy cortés y flexible con el horario. El remolque estaba limpio y resistente, exactamente lo que necesitaba. Gran descubrimiento: definitivamente volveré a alquilar a través de Lorepa.",
      cn: "Lorepa真的让我省事多了！我临时需要一个拖车，只用点击几下就预订到了。房东非常有礼貌，时间安排也很灵活。拖车干净结实，正是我所需要的。很棒的发现——我一定会再次通过Lorepa租用。",
      fr: "Lorepa m'a vraiment facilité la tâche ! J'avais besoin d'une remorque à la dernière minute et j'ai pu en réserver une en quelques clics. L'hôte a été très courtois et flexible avec l'horaire. La remorque était propre et robuste, exactement ce dont j'avais besoin. Une belle découverte — je relouerai certainement via Lorepa."
    },
    avatar: manImage2
  },
  {
    name: "Olivier Deslauriers",
    rating: 5,
    timeAgo: {
      en: "2 days ago",
      es: "hace 2 días",
      cn: "2 天前",
      fr: "il y a 2 jours"
    },
    reviewText: {
      en: "Lorepa is truly a convenient solution! I was able to book a trailer in just a few minutes, and the host was very helpful from start to finish. The trailer was in great condition and perfectly suited my need to move some furniture. I’m very satisfied with the experience and will definitely use Lorepa again.",
      es: "¡Lorepa es verdaderamente una solución conveniente! Pude reservar un remolque en solo unos minutos y el anfitrión fue de gran ayuda de principio a fin. El remolque estaba en excelentes condiciones y se adaptaba perfectamente a mi necesidad de mover algunos muebles. Estoy muy satisfecho con la experiencia y definitivamente volveré a usar Lorepa.",
      cn: "Lorepa确实是一个方便的解决方案！我只用了几分钟就预订了拖车，而且房东从头到尾都非常乐于助人。拖车状况良好，非常适合我搬家具的需求。我对这次体验非常满意，将来肯定会再次使用Lorepa。",
      fr: "Lorepa est vraiment une solution pratique ! J'ai pu réserver une remorque en quelques minutes seulement, et l'hôte a été très serviable du début à la fin. La remorque était en excellent état et convenait parfaitement à mon besoin de déménager des meubles. Je suis très satisfait de l'expérience et je réutiliserai certainement Lorepa."
    },
    avatar: manImage3
  }
];


const fadeVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};



const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div layout className="rounded-md mb-3 bg-white shadow-sm overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 text-left font-medium text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 border-t border-gray-300 text-gray-700"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ReviewBar = ({ label, percentage }) => (
  <div className="flex items-center flex-wrap mb-1 justify-between">
    <span className="text-sm text-gray-700 w-24">{label}</span>
    <div className='flex items-center gap-x-3'>
      <div className="w-[10rem] md:min-w-[20rem] bg-[#BBCBF0] rounded-sm h-2 mx-2">
        <div className="bg-[#2563EB] h-2 rounded-sm" style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-sm text-gray-700 w-8 text-right">{percentage}%</span>
    </div>
  </div>
);

const ReviewCard = ({ name, rating, timeAgo, reviewText, avatar }) => (
  <div className="border-b border-gray-200 pb-4 mb-4 md:w-[50%]">
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-x-2'>
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold text-gray-900 mr-2">{name}</p>
          <div className="flex text-[#2563EB]">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-2">{timeAgo}</p>
    </div>
    <p className="text-[#757982] text-sm mt-2">{reviewText}</p>
  </div>
);

const SingleTrailer = () => {
  const isLogin = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faqGuest, setFaqGuest] = useState([]);
  const [faqHost, setFaqHost] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nav = useNavigate();
  const [randomReview, setRandomReview] = useState({});
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return singleTrailerTranslations[storedLang] || singleTrailerTranslations.fr;
  });
  const [translations2, setTranslations2] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return trailersListingTranslations[storedLang] || trailersListingTranslations.fr;
  });

  const getFaqData = (lang) => {
    return {
      guest: [
        { question: lang.faqRenter1Q, answer: lang.faqRenter1A },
        { question: lang.faqRenter2Q, answer: lang.faqRenter2A },
        { question: lang.faqRenter3Q, answer: lang.faqRenter3A },
        { question: lang.faqRenter4Q, answer: lang.faqRenter4A },
        { question: lang.faqRenter5Q, answer: lang.faqRenter5A },
        { question: lang.faqRenter6Q, answer: lang.faqRenter6A },
        { question: lang.faqRenter7Q, answer: lang.faqRenter7A },
        { question: lang.faqRenter8Q, answer: lang.faqRenter8A },
        { question: lang.faqRenter9Q, answer: lang.faqRenter9A },
        { question: lang.faqRenter10Q, answer: lang.faqRenter10A },
        { question: lang.faqRenter11Q, answer: lang.faqRenter11A },
        { question: lang.faqRenter12Q, answer: lang.faqRenter12A },
        { question: lang.faqRenter13Q, answer: lang.faqRenter13A },
        { question: lang.faqGlobal1Q, answer: lang.faqGlobal1A },
        { question: lang.faqGlobal2Q, answer: lang.faqGlobal2A },
        { question: lang.faqGlobal3Q, answer: lang.faqGlobal3A },
      ],
      host: [
        { question: lang.faqOwner1Q, answer: lang.faqOwner1A },
        { question: lang.faqOwner2Q, answer: lang.faqOwner2A },
        { question: lang.faqOwner3Q, answer: lang.faqOwner3A },
        { question: lang.faqOwner4Q, answer: lang.faqOwner4A },
        { question: lang.faqOwner5Q, answer: lang.faqOwner5A },
        { question: lang.faqOwner6Q, answer: lang.faqOwner6A },
        { question: lang.faqOwner7Q, answer: lang.faqOwner7A },
        { question: lang.faqOwner8Q, answer: lang.faqOwner8A },
        { question: lang.faqOwner9Q, answer: lang.faqOwner9A },
        { question: lang.faqOwner10Q, answer: lang.faqOwner10A },
        { question: lang.faqOwner11Q, answer: lang.faqOwner11A },
        { question: lang.faqOwner12Q, answer: lang.faqOwner12A },
        { question: lang.faqGlobal1Q, answer: lang.faqGlobal1A },
        { question: lang.faqGlobal2Q, answer: lang.faqGlobal2A },
        { question: lang.faqGlobal3Q, answer: lang.faqGlobal3A },
      ]
    };
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem('lang');
      const currentTranslations = singleTrailerTranslations[storedLang] || singleTrailerTranslations.fr;
      const currentTranslations2 = trailersListingTranslations[storedLang] || trailersListingTranslations.fr;
      setTranslations(currentTranslations);
      setTranslations2(currentTranslations2);
      const faqs = getFaqData(currentTranslations);
      setFaqGuest(faqs.guest);
      setFaqHost(faqs.host);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Initial load

    // Set a random review on component mount
    const randomIndex = Math.floor(Math.random() * reviews.length);
    setRandomReview(reviews[randomIndex]);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchTrailer = async () => {
      const id = window.location.pathname.split('/').pop();
      try {
        const res = await axios.get(`${config.baseUrl}/trailer/single/${id}`);
        setTrailer(res.data.data);
      } catch (err) {
        setError(translations.failedToFetch);
      } finally {
        setLoading(false);
      }
    };
    fetchTrailer();
    window.scrollTo(0, 0);
  }, [translations]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === trailer.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? trailer.images.length - 1 : prevIndex - 1
    );
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
      window.location.href = data.url;

    } catch (error) {
      toast.error("Payment failed", { id: loadingToast });
    }
  };

  const currentLang = localStorage.getItem('lang') || 'en';

  if (loading || error || !trailer) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-inter">
        <Navbar />
        <p className={error ? 'text-red-500' : ''}>
          {loading ? translations.loading : error || translations.trailerNotFound}
        </p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <motion.div
          className="mb-8 rounded-lg overflow-hidden shadow-lg relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={trailer.images?.[currentImageIndex] || `https://placehold.co/800x400/F3F4F6/9CA3AF?text=${encodeURIComponent(translations.noImage)}`}
            alt={trailer.title}
            className="w-full object-cover"
          />
          {trailer.images && trailer.images.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-[#2563EB] text-white p-3 rounded-full hover:bg-opacity-75 transition-colors"
                onClick={handlePrevImage}
              >
                <FaChevronLeft />
              </button>
              <button
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-[#2563EB] text-white p-3 rounded-full hover:bg-opacity-75 transition-colors"
                onClick={handleNextImage}
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </motion.div>

        <motion.div className="bg-white rounded-lg" variants={fadeVariant} initial="hidden" animate="visible">
          <div>
            <div className="border border-[#C3C3C3] p-5 rounded-lg mb-4">
              <h2 className="text-[20px] font-[600] text-[#0A0F18] mb-4">{translations.basicInfo}</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-600">{translations.trailerTitle}</p>
                <p className="text-gray-800 text-right">{trailer.title}</p>
                {/* <p className="text-gray-600">{translations.trailerId}</p>
                <p className="text-gray-800 text-right truncate">{trailer._id}</p> */}

                <p className="text-gray-600">{translations.nameOfOwner}</p>
                <p className="text-gray-800 text-right">{trailer.userId?.name || translations.unknownOwner}</p>

                <p className="text-gray-600">{translations.category}</p>
                <p className="text-gray-800 text-right">{trailer.category}</p>


                <p className="text-gray-600">{translations.detailedDescription}</p>
                <p className="text-gray-800 text-right">{trailer.description}</p>
              </div>
            </div>

            <div className='border border-[#C3C3C3] p-5 rounded-lg mb-4'>
              <h3 className="text-[20px] font-[600] text-[#0A0F18] mb-4">{translations.pricingRentalTerms}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className='text-gray-600'>{translations.daily}</p>
                <p className='text-gray-800 text-right'>${trailer.dailyRate}</p>
                {/* 
                <p className='text-gray-600'>{translations.deposit}</p>
                <p className='text-gray-800 text-right'>${trailer.depositRate}</p> */}
              </div>
            </div>
          </div>

          <div>

            <div className="border border-[#C3C3C3] p-5 rounded-lg mb-4">
              <h2 className="text-[20px] font-[600] text-[#0A0F18] mb-4">{translations.trailerDetails}</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-600">{translations.hitchType}</p>
                <p className="text-gray-800 text-right">{trailer.hitchType || '-'}</p>

                <p className="text-gray-600">{translations.ballSize}</p>
                <p className="text-gray-800 text-right">{trailer.ballSize || '-'}</p>

                <p className="text-gray-600">{translations.weightCapacity}</p>
                <p className="text-gray-800 text-right">{trailer.weightCapacity || '-'}</p>

                <p className="text-gray-600">{translations.lightPlugConfiguration}</p>
                <p className="text-gray-800 text-right">{trailer.lightPlug || '-'}</p>

                <p className="text-gray-600">{translations.trailerDimension}</p>
                <p className="text-gray-800 text-right">{trailer.dimensions || '-'}</p>

                <p className="text-gray-600">{translations.year}</p>
                <p className="text-gray-800 text-right">{trailer.year || '-'}</p>

                <p className="text-gray-600">{translations.make}</p>
                <p className="text-gray-800 text-right">{trailer.make || '-'}</p>

                <p className="text-gray-600">{translations.model}</p>
                <p className="text-gray-800 text-right">{trailer.model || '-'}</p>

                <p className="text-gray-600">{translations.length}</p>
                <p className="text-gray-800 text-right">{trailer.length || '-'}</p>
              </div>
            </div>


            {/* <div className="border border-[#C3C3C3] p-5 rounded-lg">
              <h3 className="text-[20px] font-[600] text-[#0A0F18] mb-4">{translations.finalSetup}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className='text-gray-600'>{translations.trailerValue}</p>
                <p className='text-gray-800 text-right'>${Number(trailer?.dailyRate) + Number(trailer?.monthlyRate) + Number(trailer?.cleaningRate) + Number(trailer?.securityRate) + Number(trailer?.insuranceDeductible)}</p>
              </div>
            </div> */}

            {/* <div className="border border-[#C3C3C3] p-5 rounded-lg mt-4">
              <h2 className="text-[20px] font-[600] text-[#0A0F18] mb-4">{translations.ratingsAndReviews}</h2>
              <div className="flex items-center mb-4">
                <span className="text-4xl font-bold text-gray-800 mr-2">5.0</span>
                <div className="flex text-[#2563EB]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <ReviewBar label={translations.excellent} percentage={100} />
                <ReviewBar label={translations.good} percentage={0} />
                <ReviewBar label={translations.average} percentage={0} />
                <ReviewBar label={translations.belowAverage} percentage={0} />
                <ReviewBar label={translations.poor} percentage={0} />
              </div>

              <div className="space-y-6">
                <ReviewCard
                  name={randomReview.name}
                  rating={randomReview.rating}
                  timeAgo={randomReview.timeAgo?.[currentLang] || randomReview.timeAgo.fr}
                  reviewText={randomReview.reviewText?.[currentLang] || randomReview.reviewText.fr}
                  avatar={randomReview.avatar}
                />
              </div>
              <button className="mt-6 bg-[#2563EB] text-white hover:underline text-sm p-3 rounded-md">
                {translations.readMore}
              </button>
            </div> */}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex justify-end sm:space-x-4 flex-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* <button onClick={handleDownloadAppClick} className="sm:w-fit w-[100%] text-nowrap mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-md shadow-lg transition duration-200">
            {translations.chatWithOwner}
          </button> */}

          {
            (isLogin && role !== "owner") &&
            <button
              className='bg-blue-700 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-800 transition-colors'
              onClick={()=>setIsBookingModalOpen(true)}
            >
              {translations2.bookNow}
            </button>
          }
          {
            !isLogin && (
              <button onClick={() => nav('/login')} className="sm:w-fit w-[100%] text-nowrap mt-2 bg-[#2563EB] hover:bg-blue-700 text-white py-3 px-6 rounded-md shadow-lg transition duration-200" >
                {translations.signupsignin}
              </button>
            )
          }
        </motion.div>

        {/* FAQ Section */}

        <div className="px-5 py-5 text-black">

          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{translations.faqTitle}</h2>

          <div className='flex flex-wrap justify-between gap-x-5 mt-8'>

            <div className='w-full md:w-[48%] bg-[#F1F1F1] p-5 rounded-md mt-8 md:mt-0'>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">{translations.guests}</h3>
              {faqGuest.map((faq, index) => (
                <AccordionItem key={`guest-faq-${index}`} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className='w-full md:w-[48%] bg-[#F1F1F1] p-5 rounded-md mt-8 md:mt-0'>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">{translations.hosts}</h3>
              {faqHost.map((faq, index) => (
                <AccordionItem key={`host-faq-${index}`} question={faq.question} answer={faq.answer} />
              ))}
            </div>

          </div>

        </div>
      </main>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={()=>setIsBookingModalOpen(false)}
        trailer={trailer}
        translations={translations2}
        onSubmit={handleBookingSubmit}
      />


      <Footer />
    </div>
  );
};

export default SingleTrailer;