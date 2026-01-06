import { IoChatbox, IoSettingsOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { BsBuildings } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { FaRegBell, FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { GrDocumentText } from "react-icons/gr";
import { RxGear } from "react-icons/rx";
import { RiCalendarTodoFill } from "react-icons/ri";

export const userNav = [
    { id: 1, link: "home", key: "dashboard", icon: <GoHome /> },
    { id: 2, link: "reservation", key: "reservation", icon: <FaRegCalendarAlt /> },
    { id: 3, link: "payment", key: "payment", icon: <HiOutlineCreditCard /> },
    { id: 4, link: "document", key: "document", icon: <GrDocumentText /> },
    { id: 5, link: "messaging", key: "messaging", icon: <IoChatbox /> },
    { id: 6, link: "notification", key: "notifications", icon: <FaRegBell /> },
    { id: 7, link: "support", key: "support", icon: <RxGear /> },
    { id: 8, link: "profile", key: "profile", icon: <RxGear /> },
];

export const buyerNav = [
    { id: 1, link: "home", key: "dashboard", icon: <GoHome /> },
    { id: 2, link: "listing", key: "listing", icon: <RiCalendarTodoFill /> },
    { id: 3, link: "reservation", key: "reservation", icon: <RiCalendarTodoFill /> },
    { id: 4, link: "earnings", key: "earnings", icon: <GrDocumentText /> },
    { id: 5, link: "messaging", key: "messaging", icon: <IoChatbox /> },
    { id: 6, link: "support", key: "support", icon: <RxGear /> },
    { id: 7, link: "profile", key: "profile", icon: <RxGear /> },
];


export const adminNav = [
    { id: 1, link: "home", key: "dashboard", icon: <GoHome /> },
    { id: 2, link: "listing", key: "listing", icon: <BsBuildings /> },
    { id: 3, link: "booking", key: "booking", icon: <IoCalendarOutline /> },
    { id: 4, link: "user", key: "user", icon: <FiUser /> },
    { id: 5, link: "settings", key: "settings", icon: <IoSettingsOutline /> },
    { id: 6, link: "support", key: "support", icon: <IoSettingsOutline /> },
];
