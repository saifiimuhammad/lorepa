import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaMobileAlt, FaBell } from 'react-icons/fa';
import config from '../../../config';
import { userNotificationTranslations } from './translation/userNotificationTranslations';


// --- Custom Toggle Switch ---
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
  </label>
);

// --- Notification Preferences Card ---
const NotificationPreferences = ({ preferences, onToggle, t }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg h-fit">
    <h2 className="text-lg font-bold text-gray-800 mb-6">{t.notificationPreferences}</h2>

    <div className="space-y-6">
      {/* Email */}
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <FaEnvelope className="text-xl text-[#2563EB] mt-1" />
          <div>
            <p className="font-semibold text-gray-700">{t.emailNotifications}</p>
            <p className="text-sm text-gray-500 max-w-xs">{t.emailDescription}</p>
          </div>
        </div>
        <ToggleSwitch checked={preferences.email} onChange={() => onToggle('email')} />
      </div>

      {/* SMS */}
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <FaMobileAlt className="text-xl text-[#2563EB] mt-1" />
          <div>
            <p className="font-semibold text-gray-700">{t.smsNotifications}</p>
            <p className="text-sm text-gray-500 max-w-xs">{t.smsDescription}</p>
          </div>
        </div>
        <ToggleSwitch checked={preferences.sms} onChange={() => onToggle('sms')} />
      </div>

      {/* In-App */}
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <FaBell className="text-xl text-[#2563EB] mt-1" />
          <div>
            <p className="font-semibold text-gray-700">{t.inAppNotifications}</p>
            <p className="text-sm text-gray-500 max-w-xs">{t.inAppDescription}</p>
          </div>
        </div>
        <ToggleSwitch checked={preferences.inApp} onChange={() => onToggle('inApp')} />
      </div>
    </div>

    <button className="w-full mt-8 py-2.5 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-300/50">
      {t.savePreferences}
    </button>
  </div>
);

// --- Activity Item ---
const ActivityItem = ({ icon, title, description, time, isNew }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
    <div className='flex items-start'>
      <div className="mr-4 mt-1">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
          {icon}
        </div>
      </div>
      <div>
        <p className="font-medium flex-1 text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-x-1 text-xs text-gray-400 font-medium ml-4">
      {isNew && <span className="min-w-2 min-h-2 bg-blue-500 rounded-full"></span>}
      <span>{time}</span>
    </div>
  </div>
);

// --- Recent Activity List ---
const RecentActivity = ({ activities, t }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-lg font-bold text-gray-800 mb-2">{t.recentActivity}</h2>
    <div className="divide-y divide-gray-100">
      {activities.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
    </div>
  </div>
);

// --- Main Component ---
const UserNotification = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    inApp: true,
  });
  const [activities, setActivities] = useState([]);
  const [t, setT] = useState(() => {
    const lang = localStorage.getItem("lang") || "fr";
    return userNotificationTranslations[lang] || userNotificationTranslations.fr;
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await axios.get(`${config.baseUrl}/notification/user/${userId}`);
      const notifs = res.data.data.map(notif => ({
        icon: <FaBell />,
        title: notif.title,
        description: notif.description,
        time: new Date(notif.createdAt).toLocaleString(),
        isNew: !notif.isRead,
      }));
      setActivities(notifs);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleLangChange = () => {
      const lang = localStorage.getItem("lang") || "fr";
      setT(userNotificationTranslations[lang] || userNotificationTranslations.fr);
    };

    window.addEventListener("storage", handleLangChange);
    handleLangChange();

    return () => window.removeEventListener("storage", handleLangChange);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">{t.notifications}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preferences */}
        <div className="lg:col-span-1">
          <NotificationPreferences preferences={preferences} onToggle={handleToggle} t={t} />
        </div>

        {/* Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} t={t} />
        </div>
      </div>
    </div>
  );
};

export default UserNotification;
