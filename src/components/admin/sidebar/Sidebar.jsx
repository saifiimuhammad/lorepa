import React, { useEffect, useRef, useState } from 'react';
import { adminNav } from '../../../constants/sidebarData';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOut } from 'react-icons/io5';
import { useSidebar } from '../../../context/SidebarContext';
import { RxCross2 } from 'react-icons/rx';
import Logo from '../../../assets/logo.svg'
import { sidebarTranslations } from '../../../i18n/translations';

const Sidebar = () => {

  const location = useLocation().pathname.split("/")[3];
  const { isNavOpen, toggleNav } = useSidebar();
  const sidebarRef = useRef(null);
  const nav = useNavigate();

  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || "fr"
  );

  const t = sidebarTranslations[lang];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleNav();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleNav]);



  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`lg:block hidden w-[15rem] h-[100vh] bg-[#2563EB] relative border-r border-r-[#D8D8D880]`}>

        <div onClick={() => nav("/")} className="flex-shrink-0 flex items-center gap-x-2 p-5 border-b border-b-[#fff]">
          <span className="text-xl text-white">LOREPA</span>
        </div>


        <div className='mt-8'>
          {adminNav?.map((i) => (
            <Link to={`/admin/dashboard/${i.link}`} key={i.id} className={`flex ${location == i.link && "bg-[#fff]"} px-5 p-2  items-center gap-x-3 mb-2 cursor-pointer`}>
              <div className={`${location == i.link ? "text-[#2563EB]" : "text-[#fff]"}`}>{i.icon}</div>
              <p className={`text-sm ${location == i.link ? "text-[#000]" : "text-[#fff]"}`}>{t[i.key]}</p>
            </Link>
          ))}
        </div>

        <div onClick={() => nav("/admin/login")} className='absolute bottom-5 w-[80%] flex items-center gap-x-3 cursor-pointer mx-5 '>
          <IoLogOut className='text-[#FF3B30] cursor-pointer text-xl' />
          <p className='text-[#C9C9C9]'>{t.logout}</p>
        </div>

      </div>

      {/* Mobile Sidebar */}
      {
        isNavOpen && (
          <div className={`lg:hidden block w-[14rem] z-50 h-[100vh] bg-[#2563EB] fixed top-0 left-0 transition-all duration-300 ease-in-out ${isNavOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`} ref={sidebarRef}>

            <div onClick={() => nav("/")} className="flex-shrink-0 flex items-center gap-x-2 p-5 cursor-pointer">
              <span className="text-xl text-white">LOREPA</span>
            </div>


            <div className='mt-8'>
              {adminNav?.map((i) => (
                <Link to={`/admin/dashboard/${i.link}`} key={i.id} className={`flex ${location == i.link && "bg-[#fff]"} px-5 p-2  items-center gap-x-3 mb-2 cursor-pointer`}>
                  <div>{i.icon}</div>
                  <p className={`text-sm ${location == i.link ? "text-[#000]" : "text-[#fff]"}`}>{t[i.key]}</p>
                </Link>
              ))}
            </div>

            <div onClick={() => nav("/admin/login")} className='absolute bottom-5 w-[80%] flex items-center gap-x-3 cursor-pointer mx-5 '>
              <IoLogOut className='text-[#FF3B30] cursor-pointer text-xl' />
              <p className='text-[#C9C9C9]'>{t.logout}</p>
            </div>

          </div>
        )}
    </>
  );
};

export default Sidebar;
