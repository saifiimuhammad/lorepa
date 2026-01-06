import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaTruck, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { IoWalletOutline } from 'react-icons/io5';
import axios from 'axios';
import config from '../../../config';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardTranslations } from './translation/buyerHome';

const KpiCard = ({ title, value, detail, icon: Icon, iconColor, iconBg }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4 transition duration-300 hover:shadow-lg">
    <div className={`p-3 rounded-full ${iconBg} flex-shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 mt-1">{value}</h2>
      {detail && <p className="text-sm mt-1 text-gray-500">{detail}</p>}
    </div>
  </div>
);

const ReservationItem = ({ image, title, date, renter, status, details, handleRoute, t }) => (
  <div className="flex space-x-3 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition rounded-lg p-2 -mx-2">
    <img
      src={image}
      alt={title}
      className="w-20 h-14 object-cover rounded-lg border"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/80x56/A3A3A3/FFFFFF?text=Trailer";
      }}
    />
    <div className="flex-grow min-w-0">
      <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
      <p className="text-xs text-gray-600">{date}</p>
      <div className="flex items-center text-xs text-gray-500">
        <FaUserCircle className="mr-1 text-blue-500" />
        <span className="truncate">{renter}</span>
      </div>
      {status && (
        <span className="inline-flex px-2 py-[2px] mt-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {t(status)}
        </span>
      )}
    </div>
    <button onClick={handleRoute} className="text-blue-600 text-xs font-medium">
      {details}
    </button>
  </div>
);

const RevenueChart = ({ t }) => (
  <div className="w-full h-64 p-4">
    <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#3B82F6"
        strokeWidth="3"
        points="0,170 80,100 160,130 240,80 320,150 400,50 480,140"
      />
      <polyline
        fill="none"
        stroke="#F97316"
        strokeWidth="3"
        points="0,120 80,150 160,110 240,130 320,100 400,90 480,110"
      />
    </svg>

    <div className="flex justify-center space-x-6 text-sm mt-4">
      <div className="flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        {t("revenue")}
      </div>
      <div className="flex items-center">
        <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
        {t("targetLabel")}
      </div>
    </div>
  </div>
);

export default function App() {
  const [data, setData] = useState(null);
  const nav = useNavigate();

  const lang = localStorage.getItem("lang") || "fr";
  const t = (key) => dashboardTranslations[lang]?.[key] || key;

  useEffect(() => {
    axios
      .get(`${config.baseUrl}/account/details/${localStorage.getItem("userId")}`)
      .then(res => setData(res?.data?.data));
  }, []);

  const amount =
    data?.booking?.filter(i => i?.status === "completed")
      .reduce((a, c) => a + c?.price, 0) || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("welcome")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KpiCard title={t("totalEarnings")} value={`$${amount}`} detail={t("vsLastMonth")} icon={IoWalletOutline} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <KpiCard title={t("ytd")} value={`$${amount}`} detail={t("target")} icon={FaCalendarAlt} iconBg="bg-indigo-100" iconColor="text-indigo-600" />
        <KpiCard title={t("activeTrailers")} value={`${data?.trailer?.length || 0} Units`} detail={t("allListings")} icon={FaTruck} iconBg="bg-green-100" iconColor="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("revenueOverview")}</h2>
            <span className="text-sm flex items-center">
              {t("monthly")} <FaChevronDown className="ml-1" />
            </span>
          </div>
          <RevenueChart t={t} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow h-[24rem] overflow-y-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("reservations")}</h2>
            <Link to="/seller/dashboard/reservation" className="text-blue-600 text-sm">
              {t("viewAll")}
            </Link>
          </div>

          {data?.booking?.map(i => (
            <ReservationItem
              key={i._id}
              image={i?.trailerId?.images[0]}
              title={i?.trailerId?.title}
              date={`${i?.startDate} - ${i?.endDate}`}
              renter={i?.user_id?.name}
              status={i?.status}
              details={t("viewDetails")}
              handleRoute={() => nav("/seller/dashboard/reservation")}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
