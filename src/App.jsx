
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoaderGif from './assets/loader.gif';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import VerifyPage from './pages/Auth/VerifyPage';
import AdminHomePage from './pages/Admin/Dashboard/AdminHomePage';
import AdminUserPage from './pages/Admin/Dashboard/AdminUserPage';
import AdminSupportPage from './pages/Admin/Dashboard/AdminSupportPage';
import AdminLogin from './pages/Admin/Auth/AdminLogin';
import AdminRegister from './pages/Admin/Auth/AdminRegister';
import AdminForget from './pages/Admin/Auth/AdminForget';
import AdminListingPage from './pages/Admin/Dashboard/AdminListingPage';
import AdminListingDetailPage from './pages/Admin/Dashboard/AdminListingDetailPage';
import AdminBookingPage from './pages/Admin/Dashboard/AdminBookingPage';
import AdminUserDetailPage from './pages/Admin/Dashboard/AdminUserDetailPage';
import AdminSettingsPage from './pages/Admin/Dashboard/AdminSettingsPage';
import WhoPage from './pages/WhoPage';
import FaqPage from './pages/FaqPage';
import CalculatorPage from './pages/CalculatorPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import BecomeHostPage from './pages/BecomeHostPage';
import BookingPage from './pages/BookingPage';
import ListTrailer from './pages/ListTrailer';
import TrailersLisitng from './pages/TrailersLisitng';
import SingleTrailer from './pages/SingleTrailer';
import CompareTrailer from './pages/CompareTrailer';
import CookiesPage from './pages/CookiesPage';
import LegalPage from './pages/LegalPage';
import UserRegister from './pages/User/Auth/UserRegister';
import UserLogin from './pages/User/Auth/UserLogin';
import UserForget from './pages/User/Auth/UserForget';
import UserHome from './pages/User/Dashboard/UserHome';
import UserReservation from './pages/User/Dashboard/UserReservation';
import UserPayment from './pages/User/Dashboard/UserPayment';
import UserDocument from './pages/User/Dashboard/UserDocument';
import UserNotification from './pages/User/Dashboard/UserNotification';
import UserSupport from './pages/User/Dashboard/UserSupport';
import BuyerLogin from './pages/Seller/Auth/BuyerLogin';
import BuyerRegister from './pages/Seller/Auth/BuyerRegister';
import BuyerForget from './pages/Seller/Auth/BuyerForget';
import BuyerHome from './pages/Seller/Dashboard/BuyerHome';
import BuyerListing from './pages/Seller/Dashboard/BuyerListing';
import BuyerReservation from './pages/Seller/Dashboard/BuyerReservation';
import BuyerPayment from './pages/Seller/Dashboard/BuyerPayment';
import BuyerDocument from './pages/Seller/Dashboard/BuyerDocument';
import BuyerSupport from './pages/Seller/Dashboard/BuyerSupport';
import BuyerMessaging from './pages/Seller/Dashboard/BuyerMessaging';
import CookieConsent from './components/CookieConsent';
import UserProfilePage from './pages/User/Dashboard/UserProfilePage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import ForgetPasswordPage from './pages/Auth/ForgetPasswordPage';
import VerifyOtpPage from './pages/Auth/VerifyOtpPage';
import ChangePasswordPage from './pages/Auth/ChangePasswordPage';
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const AdminLayout = lazy(() => import('./components/admin/Layout'));
const UserLayout = lazy(() => import('./components/user/Layout'));
const BuyerLayout = lazy(() => import('./components/buyer/Layout'));


function SuspenseWithDelay({ children, fallback, delay = 0, minDisplayTime = 2000 }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return isLoading ? (
    <div className="flex justify-center items-center w-screen h-screen">
      <img src={LoaderGif} alt="Loading..." className="h-[6rem]" />
    </div>
  ) : (
    <Suspense fallback={fallback}>{children}</Suspense>
  );
}

function App() {
  return (
    <>
      <Toaster />
      <CookieConsent />
      <BrowserRouter>
        <SuspenseWithDelay fallback={<div className="flex justify-center items-center w-screen h-screen"><img src={LoaderGif} alt="HopOn Dashboard- Loader" className="h-[6rem]" /></div>} minDisplayTime={2000}>

          <Routes>
            <Route path='/user/login' element={<UserLogin />} />
            <Route path='/user/register' element={<UserRegister />} />
            <Route path='/user/forget' element={<UserForget />} />
            <Route path="/user/dashboard/" element={<UserLayout />}>
              <Route path="home" element={<UserHome />} />
              <Route path="reservation" element={<UserReservation />} />
              <Route path="payment" element={<UserPayment />} />
              <Route path="booking" element={<AdminBookingPage />} />
              <Route path="document" element={<UserDocument />} />
              <Route path="notification" element={<UserNotification />} />
              <Route path="support" element={<UserSupport />} />
              <Route path="messaging" element={<BuyerMessaging />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>

            <Route path='/seller/login' element={<BuyerLogin />} />
            <Route path='/seller/register' element={<BuyerRegister />} />
            <Route path='/seller/forget' element={<BuyerForget />} />
            <Route path="/seller/dashboard/" element={<BuyerLayout />}>
              <Route path="home" element={<BuyerHome />} />
              <Route path="listing" element={<BuyerListing />} />
              <Route path="reservation" element={<BuyerReservation />} />
              <Route path="earnings" element={<BuyerPayment />} />
              <Route path="documents" element={<BuyerDocument />} />
              <Route path="support" element={<BuyerSupport />} />
              <Route path="messaging" element={<BuyerMessaging />} />
              <Route path="notification" element={<UserNotification />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>

            <Route path='/admin/'>
              <Route path='login' element={<AdminLogin />} />
              <Route path='register' element={<AdminRegister />} />
              <Route path='forget' element={<AdminForget />} />
            </Route>

            <Route path="/admin/dashboard/" element={<AdminLayout />}>
              <Route path="home" element={<AdminHomePage />} />
              <Route path="listing" element={<AdminListingPage />} />
              <Route path="listing/:id" element={<AdminListingDetailPage />} />
              <Route path="booking" element={<AdminBookingPage />} />
              <Route path="user" element={<AdminUserPage />} />
              <Route path="support" element={<AdminSupportPage />} />
              <Route path="user/:id" element={<AdminUserDetailPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>


            <Route path='/' element={<LandingPage />} />
            <Route path='/who' element={<WhoPage />} />
            <Route path='/faq' element={<FaqPage />} />
            <Route path='/calculator' element={<CalculatorPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/privacy' element={<PrivacyPage />} />
            <Route path='/cookie' element={<CookiesPage />} />
            <Route path='/legal' element={<LegalPage />} />
            <Route path='/terms' element={<TermsPage />} />
            <Route path='/host' element={<BecomeHostPage />} />
            <Route path='/list' element={<ListTrailer />} />
            <Route path='/booking' element={<BookingPage />} />
            <Route path='/trailers' element={<TrailersLisitng />} />
            <Route path='/trailers/:id' element={<SingleTrailer />} />
            <Route path='/compare' element={<CompareTrailer />} />

            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/forget-password' element={<ForgetPasswordPage />} />
            <Route path='/verify-otp' element={<VerifyOtpPage />} />
            <Route path='/change-password' element={<ChangePasswordPage />} />
            <Route path='/verify' element={<VerifyPage />} />

            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel/>} />




          </Routes>
        </SuspenseWithDelay>
      </BrowserRouter>
    </>
  );
}

export default App;
