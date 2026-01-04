import React, { useState, useEffect } from "react";

const translations = {
  en: {
    title: "👉 We value your privacy",
    message:
      "We use cookies to improve your experience, analyze site traffic, and personalize content. You can accept, reject, or customize your choices at any time.",
    buttons: {
      acceptAll: "Accept all",
      rejectAll: "Reject all",
      customize: "Customize",
      save: "Save my choices",
    },
    categories: {
      essential: "Essential (always active)",
      essentialDesc:
        "Required for security and the proper functioning of the site (login, cart, navigation).",
      performance: "Performance / Analytics",
      performanceDesc:
        "Helps us understand how you use the site to improve our services.",
      functional: "Functional",
      functionalDesc:
        "Enables certain features such as video, interactive map, or chat.",
      marketing: "Marketing / Advertising",
      marketingDesc:
        "Used to display relevant ads and measure campaign effectiveness.",
    },
  },
  fr: {
    title: "👉 Nous respectons votre vie privée",
    message:
      "Nous utilisons des cookies pour améliorer votre expérience, analyser l’audience et proposer un contenu personnalisé. Vous pouvez accepter, refuser ou personnaliser vos choix à tout moment.",
    buttons: {
      acceptAll: "Accepter tout ✅",
      rejectAll: "Refuser tout ❌",
      customize: "Personnaliser ⚙️",
      save: "Enregistrer mes choix",
    },
    categories: {
      essential: "Essentiels (toujours actifs)",
      essentialDesc:
        "Nécessaires pour la sécurité et le bon fonctionnement du site (connexion, panier, navigation).",
      performance: "Performance / Analytics",
      performanceDesc:
        "Nous aident à comprendre comment vous utilisez le site afin d’améliorer nos services.",
      functional: "Fonctionnels",
      functionalDesc:
        "Permettent d’activer certaines fonctionnalités comme la vidéo, la carte interactive ou le chat.",
      marketing: "Marketing / Publicité",
      marketingDesc:
        "Utilisés pour afficher des publicités pertinentes et mesurer nos campagnes.",
    },
  },
  es: {
    title: "👉 Valoramos tu privacidad",
    message:
      "Usamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido. Puedes aceptar, rechazar o personalizar tus elecciones en cualquier momento.",
    buttons: {
      acceptAll: "Aceptar todo",
      rejectAll: "Rechazar todo",
      customize: "Personalizar",
      save: "Guardar mis elecciones",
    },
    categories: {
      essential: "Esencial (siempre activo)",
      essentialDesc:
        "Requerido para la seguridad y el correcto funcionamiento del sitio (inicio de sesión, carrito, navegación).",
      performance: "Rendimiento / Analítica",
      performanceDesc:
        "Nos ayuda a entender cómo usas el sitio para mejorar nuestros servicios.",
      functional: "Funcional",
      functionalDesc:
        "Permite ciertas funciones como video, mapa interactivo o chat.",
      marketing: "Marketing / Publicidad",
      marketingDesc:
        "Usado para mostrar anuncios relevantes y medir la efectividad de las campañas.",
    },
  },
  cn: {
    title: "👉 我们重视您的隐私",
    message:
      "我们使用 Cookie 来改善您的体验、分析网站流量并个性化内容。您可以随时接受、拒绝或自定义您的选择。",
    buttons: {
      acceptAll: "全部接受",
      rejectAll: "全部拒绝",
      customize: "自定义",
      save: "保存我的选择",
    },
    categories: {
      essential: "必要（始终启用）",
      essentialDesc:
        "确保网站安全和正常运行所必需（登录、购物车、导航）。",
      performance: "性能 / 分析",
      performanceDesc:
        "帮助我们了解您如何使用网站，从而改善我们的服务。",
      functional: "功能性",
      functionalDesc: "启用某些功能，如视频、交互式地图或聊天。",
      marketing: "营销 / 广告",
      marketingDesc: "用于展示相关广告并衡量广告活动效果。",
    },
  },
};

const COOKIE_KEY = "lorepa_cookie_consent";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState({
    essential: true,
    performance: false,
    functional: false,
    marketing: false,
  });
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
  const t = translations[lang];

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_KEY);
    if (!savedConsent) setShowBanner(true);
    else setConsent(JSON.parse(savedConsent));
  }, []);

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem("lang") || "fr");
    };
    window.addEventListener("storage", handleLangChange);
    return () => window.removeEventListener("storage", handleLangChange);
  }, []);

  const saveConsent = (newConsent) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () =>
    saveConsent({ essential: true, performance: true, functional: true, marketing: true });
  const handleRejectAll = () =>
    saveConsent({ essential: true, performance: false, functional: false, marketing: false });
  const toggleCategory = (category) =>
    setConsent((prev) => ({ ...prev, [category]: !prev[category] }));
  const handleSavePreferences = () => saveConsent(consent);

  if (!showBanner && !showPreferences) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-16 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6 md:p-8">
      {!showPreferences ? (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="md:max-w-xl">
            <h2 className="font-bold text-xl md:text-2xl mb-2">{t.title}</h2>
            <p className="text-gray-700 text-sm md:text-base">{t.message}</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
            <button onClick={handleAcceptAll} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition">
              {t.buttons.acceptAll}
            </button>
            <button onClick={handleRejectAll} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition">
              {t.buttons.rejectAll}
            </button>
            <button onClick={() => setShowPreferences(true)} className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-medium transition">
              {t.buttons.customize}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {["essential", "performance", "functional", "marketing"].map((cat) => (
            <div key={cat} className="flex flex-col gap-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent[cat]}
                  disabled={cat === "essential"}
                  onChange={() => toggleCategory(cat)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                />
                <div>
                  <span className="font-semibold">{t.categories[cat]}</span>
                  <p className="text-gray-600 text-sm">{t.categories[`${cat}Desc`]}</p>
                </div>
              </label>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
              {t.buttons.save}
            </button>
            <button onClick={handleAcceptAll} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition">
              {t.buttons.acceptAll}
            </button>
            <button onClick={handleRejectAll} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition">
              {t.buttons.rejectAll}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
