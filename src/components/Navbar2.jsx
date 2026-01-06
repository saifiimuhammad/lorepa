import axios from 'axios';
import { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiCalculator1, CiGlobe } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import Logo from "../assets/logo.svg";
import { IoCallOutline, IoKey } from "react-icons/io5";
import { BiTransfer } from 'react-icons/bi';

const navBar2Translations = {
    en: { where: "Where", from: "From", until: "Until", login: "Login", signup: "Signup", logout: "Logout", becomeAHost: "Become a host", whoAreWe: "Who are we", contactUs: "Contact us", calculator: "Calculator", montrealPlaceholder: "Montreal", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Dashboard" },
    es: { where: "¿Dónde?", from: "Desde", until: "Hasta", login: "Iniciar sesión", signup: "Registrarse", logout: "Cerrar sesión", becomeAHost: "Conviértete en anfitrión", whoAreWe: "¿Quiénes somos?", contactUs: "Contáctanos", calculator: "Calculadora", montrealPlaceholder: "Montreal", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Panel de Control" },
    cn: { where: "地点", from: "从", until: "到", login: "登录", signup: "注册", logout: "注销", becomeAHost: "成为房东", whoAreWe: "我们是谁", contactUs: "联系我们", calculator: "计算器", montrealPlaceholder: "蒙特利尔", turoVsLorepa: "Turo 对比 Lorepa", dashboard: "仪表板" },
    fr: { where: "Où", from: "Du", until: "Jusqu'à", login: "Se connecter", signup: "S'inscrire", logout: "Se déconnecter", becomeAHost: "Devenir hôte", whoAreWe: "Qui sommes-nous", contactUs: "Nous contacter", calculator: "Calculatrice", montrealPlaceholder: "Montréal", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Tableau de Bord" }
};

const useQuery = () => new URLSearchParams(useLocation().search);

const Navbar2 = () => {
    const query = useQuery();
    const nav = useNavigate();
    const wrapperRef = useRef(null);

    const cityFromQuery = query.get('city')?.toLowerCase() || '';
    const fromDateQuery = query.get('fromDate') || '';
    const fromTimeQuery = query.get('fromTime') || '';
    const untilDateQuery = query.get('untilDate') || '';
    const untilTimeQuery = query.get('untilTime') || '';

    const [location, setLocation] = useState(cityFromQuery);
    const [fromDate, setFromDate] = useState(fromDateQuery);
    const [fromTime, setFromTime] = useState(fromTimeQuery);
    const [untilDate, setUntilDate] = useState(untilDateQuery);
    const [untilTime, setUntilTime] = useState(untilTimeQuery);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const isLogin = localStorage.getItem("userId");

    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
    const [translations, setTranslations] = useState(navBar2Translations[language] || navBar2Translations.fr);
    const [showLanguages, setShowLanguages] = useState(false);
    const [showNav, setshowNav] = useState(false);
    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang') || 'en';
            setLanguage(storedLang);
            setTranslations(navBar2Translations[storedLang] || navBar2Translations.fr);
        };
        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLanguageChange = (langSymbol) => {
        setLanguage(langSymbol);
        localStorage.setItem("lang", langSymbol);
        setShowLanguages(false);
        window.location.reload();
    };

    const fetchSuggestions = async (inputText) => {
        if (!inputText) { setSuggestions([]); return; }
        try {
            const res = await axios.get(`https://lorepa-backend.vercel.app/api/autocomplete`, { params: { input: inputText } });
            if (res.data.status === "OK") {
                const filtered = res.data.predictions.filter(pred =>
                    pred.types.includes("locality") || pred.types.includes("country") || pred.types.includes("administrative_area_level_1")
                );
                setSuggestions(filtered);
                setShowSuggestions(true);
            } else { setSuggestions([]); setShowSuggestions(false); }
        } catch (error) { console.error("Error fetching suggestions:", error); }
    };

    const handleSelect = (item) => { setLocation(item.description); setSuggestions([]); setShowSuggestions(false); };


    return (
        <nav className="border-b border-[#F1F1F1] bg-blue-600">
            <div className="px-4 sm:px-6 lg:px-8 bg-white">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center gap-x-2">
                        <Link to={"/"} className="text-xl"><img src={Logo} alt="" className='h-[8rem]' /></Link>
                    </div>

                    <div className="md:flex items-center hidden gap-x-4">
                        <div className='flex items-center gap-x-2 border border-[#C3C3C3] p-2 rounded-3xl relative' ref={wrapperRef}>
                            <label htmlFor="where" className="text-xs text-[#2563EB]">{translations.where}</label>
                            <input
                                type="text"
                                id="where"
                                value={location}
                                onChange={(e) => { setLocation(e.target.value); fetchSuggestions(e.target.value); }}
                                className="block w-full text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0"
                                placeholder={translations.montrealPlaceholder}
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="absolute z-50 top-full left-0 right-0 bg-white shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
                                    {suggestions.map((item, index) => (
                                        <li key={index} onClick={() => handleSelect(item)} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                                            {item.description}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className='flex items-center gap-x-2 border border-[#C3C3C3] p-2 rounded-3xl'>
                            <label htmlFor="fromDate" className="text-xs text-[#2563EB]">{translations.from}</label>
                            <div className="flex items-center">
                                <input type="text" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                                    className="block w-24 text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0" />
                                <input type="time" id="fromTime" value={fromTime} onChange={(e) => setFromTime(e.target.value)}
                                    className="block w-20 text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0 ml-2" />
                            </div>
                        </div>

                        <div className='flex items-center gap-x-2 border border-[#C3C3C3] p-2 rounded-3xl'>
                            <label htmlFor="untilDate" className="text-xs text-[#2563EB]">{translations.until}</label>
                            <div className="flex items-center">
                                <input type="text" id="untilDate" value={untilDate} onChange={(e) => setUntilDate(e.target.value)}
                                    className="block w-24 text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0" />
                                <input type="time" id="untilTime" value={untilTime} onChange={(e) => setUntilTime(e.target.value)}
                                    className="block w-20 text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0 ml-2" />
                            </div>
                        </div>

                        <button onClick={() => nav(`/trailers?city=${location}&fromDate=${fromDate}&fromTime=${fromTime}&untilDate=${untilDate}&untilTime=${untilTime}`)}
                            className="bg-[#2563EB] text-white p-2 rounded-full ml-2 flex items-center justify-center">
                            <CiSearch className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Language & Nav Menu */}
                    <div className="block relative">
                        <div className="ml-4 flex items-center md:ml-6 gap-x-4">
                            <CiGlobe className='cursor-pointer' onClick={() => setShowLanguages(!showLanguages)} />
                            <div className="flex items-center gap-x-2 bg-[#F1F1F1] rounded-md p-2">
                                <RxHamburgerMenu onClick={() => setshowNav(!showNav)} className='cursor-pointer' />
                                <FaRegUserCircle className='cursor-pointer' />
                            </div>
                        </div>

                        {showLanguages && (
                            <div className=' absolute z-10 right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
                                <div className='py-1'>
                                    {["en", "es", "cn", "fr"].map(lang => (
                                        <p key={lang} onClick={() => handleLanguageChange(lang)} className='cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                            {lang === "en" ? "English" : lang === "es" ? "Spanish" : lang === "cn" ? "Chinese" : "French"}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showNav && (
                            <div className=' absolute z-10 right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
                                <div className='py-1'>
                                    {isLogin && (<Link to={localStorage.getItem("role") === "owner" ? "/seller/dashboard/home" : "/user/dashboard/home"} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>{translations.dashboard}</Link>)}
                                    {!isLogin && (<Link to="/login" className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>{translations.login}</Link>)}
                                    {!isLogin && (<Link to="/register" className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>{translations.signup}</Link>)}
                                    {isLogin && (<p onClick={() => { localStorage.removeItem("userId"); window.location.reload() }} className=' cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>{translations.logout}</p>)}
                                    <div className='px-4 py-2 flex items-center gap-x-2 text-gray-700 hover:bg-gray-100 text-sm'>
                                        <IoKey /><Link to="/who">{translations.whoAreWe}</Link>
                                    </div>
                                    <div className='px-4 py-2 flex items-center gap-x-2 text-gray-700 hover:bg-gray-100 text-sm'>
                                        <IoCallOutline /><Link to="/contact">{translations.contactUs}</Link>
                                    </div>
                                    <div className='px-4 py-2 flex items-center gap-x-2 text-gray-700 hover:bg-gray-100 text-sm'>
                                        <CiCalculator1 /><Link to="/calculator">{translations.calculator}</Link>
                                    </div>
                                    <div className='px-4 py-2 flex items-center gap-x-2 text-gray-700 hover:bg-gray-100 text-sm'>
                                        <BiTransfer /><Link to="/compare">{translations.turoVsLorepa}</Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar2;
