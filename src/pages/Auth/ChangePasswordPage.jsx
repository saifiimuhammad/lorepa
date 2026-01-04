import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../../config";

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const passwordTranslations = {
  en: { title: "Change Password", newPassword: "New Password", confirmPassword: "Confirm Password", changeBtn: "Change Password" },
  es: { title: "Cambiar contraseña", newPassword: "Nueva contraseña", confirmPassword: "Confirmar contraseña", changeBtn: "Cambiar contraseña" },
  cn: { title: "更改密码", newPassword: "新密码", confirmPassword: "确认密码", changeBtn: "更改密码" },
  fr: { title: "Changer le mot de passe", newPassword: "Nouveau mot de passe", confirmPassword: "Confirmer le mot de passe", changeBtn: "Changer le mot de passe" },
};

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem("lang");
    return passwordTranslations[storedLang] || passwordTranslations.fr;
  });
  const nav = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) nav("/forget-password");
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem("lang");
      setTranslations(passwordTranslations[storedLang] || passwordTranslations.fr);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [email]);

  const changePassword = async () => {
    if (!newPassword || !confirmPassword) return toast.error("All fields are required");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    try {
      const { data } = await axios.put(`${config.baseUrl}/account/change-password-email/${email}`, { newPassword });
      toast.success(data.msg || "Password changed successfully");
      nav("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="w-full max-w-md p-6 border rounded-md shadow">
        <h2 className="text-xl mb-4">{translations.title}</h2>
        <input
          type="password"
          placeholder={translations.newPassword}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border rounded-md"
        />
        <input
          type="password"
          placeholder={translations.confirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border rounded-md"
        />
        <button onClick={changePassword} className="w-full py-2 bg-blue-600 text-white rounded-md">{translations.changeBtn}</button>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ChangePasswordPage;
