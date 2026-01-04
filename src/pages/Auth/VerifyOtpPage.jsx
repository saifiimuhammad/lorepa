import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../../config";

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const otpTranslations = {
  en: { title: "Verify OTP", otpLabel: "OTP", otpPlaceholder: "Enter OTP", verifyBtn: "Verify", resendOtp: "Resend OTP" },
  es: { title: "Verificar OTP", otpLabel: "OTP", otpPlaceholder: "Ingresa OTP", verifyBtn: "Verificar", resendOtp: "Reenviar OTP" },
  cn: { title: "验证 OTP", otpLabel: "OTP", otpPlaceholder: "输入 OTP", verifyBtn: "验证", resendOtp: "重新发送 OTP" },
  fr: { title: "Vérifier OTP", otpLabel: "OTP", otpPlaceholder: "Entrez OTP", verifyBtn: "Vérifier", resendOtp: "Renvoyer OTP" },
};

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem("lang");
    return otpTranslations[storedLang] || otpTranslations.fr;
  });
  const nav = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) nav("/forget-password");
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem("lang");
      setTranslations(otpTranslations[storedLang] || otpTranslations.fr);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [email]);

  const verifyOtp = async () => {
    try {
      await axios.post(`${config.baseUrl}/account/verify/otp`, { email, otp });
      toast.success("OTP Verified");
      nav("/change-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.msg || "OTP verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post(`${config.baseUrl}/account/send/otp/${email}`);
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full max-w-md p-6 border rounded-md shadow">
        <h2 className="text-xl mb-4">{translations.title}</h2>
        <label className="block text-sm mb-1">{translations.otpLabel}</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder={translations.otpPlaceholder}
          className="block w-full px-4 py-2 mb-4 border rounded-md"
        />
        <button onClick={verifyOtp} className="w-full py-2 bg-blue-600 text-white rounded-md">{translations.verifyBtn}</button>
        <button onClick={resendOtp} className="w-full mt-2 py-2 bg-gray-200 rounded-md">{translations.resendOtp}</button>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
