import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../../config";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const forgetTranslations = {
  en: { title: "Forgot Password", emailLabel: "Email", emailPlaceholder: "Enter your email", sendOtp: "Send OTP", backLogin: "Back to Login" },
  es: { title: "Olvidé mi contraseña", emailLabel: "Correo electrónico", emailPlaceholder: "Ingresa tu correo", sendOtp: "Enviar OTP", backLogin: "Volver al inicio de sesión" },
  cn: { title: "忘记密码", emailLabel: "电子邮件", emailPlaceholder: "输入您的电子邮件", sendOtp: "发送 OTP", backLogin: "返回登录" },
  fr: { title: "Mot de passe oublié", emailLabel: "E-mail", emailPlaceholder: "Entrez votre e-mail", sendOtp: "Envoyer OTP", backLogin: "Retour à la connexion" },
};

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem("lang");
    return forgetTranslations[storedLang] || forgetTranslations.fr;
  });
  const nav = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem("lang");
      setTranslations(forgetTranslations[storedLang] || forgetTranslations.fr);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const sendOtp = async () => {
    if (!email) return toast.error("Email is required");
    try {
      await axios.post(`${config.baseUrl}/account/send/otp/${email}`);
      toast.success("OTP sent successfully");
      nav("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full max-w-md p-6 border rounded-md shadow">
        <h2 className="text-xl mb-4">{translations.title}</h2>
        <label className="block text-sm mb-1">{translations.emailLabel}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translations.emailPlaceholder}
          className="block w-full px-4 py-2 mb-4 border rounded-md"
        />
        <button onClick={sendOtp} className="w-full py-2 bg-blue-600 text-white rounded-md">{translations.sendOtp}</button>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600">{translations.backLogin}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgetPasswordPage;
