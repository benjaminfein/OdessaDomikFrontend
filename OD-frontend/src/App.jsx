import './App.css';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes, useLocation, useParams  } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useEffect } from 'react';
import i18n from './i18n';
import CreateOrUpdateApartmentComponent from './components/CreateOrUpdateApartmentComponent';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import ListApartmentsComponentAdmin from './components/ListApartmentsComponentAdmin';
import ListApartmentsComponentClient from './components/ListApartmentsComponentClient';
import AboutApartmentComponent from './components/AboutApartmentComponent';
import LoginComponent from './components/LoginComponent';
import MainComponent from './components/MainComponent';
import RegisterComponent from './components/RegisterComponent';
import ProfileComponent from './components/ProfileComponent';
import ProtectedRoute from './components/ProtectedRoute';
import SearchingResultsComponent from './components/SearchingResultsComponent'
import ReservationComponent from './components/ReservationComponen'
import AboutUsComponent from './components/AboutUsComponent'
import ReservationsComponentAdmin from './components/ReservationsComponentAdmin'
import EmailTemplatesComponent from './components/EmailTemplatesComponent';

function AppWrapper() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}

function getLocalizedRoutes() {
  return [
    <Route path=":lang/" element={<MainComponent />} key="main" />,
    <Route path=":lang/about-us" element={<AboutUsComponent />} key="about" />,
    <Route path=":lang/login" element={<LoginComponent />} key="login" />,
    <Route path=":lang/register" element={<RegisterComponent />} key="register" />,
    <Route path=":lang/searching-results" element={<SearchingResultsComponent />} key="search" />,
    <Route path=":lang/apartments" element={<ListApartmentsComponentClient />} key="apartments" />,
    <Route path=":lang/apartments/:id/about" element={<AboutApartmentComponent />} key="apt-about" />,
    <Route path=":lang/apartments/apartment-details/:id" element={<AboutApartmentComponent />} key="apt-details" />,
    <Route path=":lang/apartments/:id/reservation" element={<ReservationComponent />} key="apt-reserve" />,
    <Route
      path=":lang/profile"
      element={
        <ProtectedRoute>
          <ProfileComponent />
        </ProtectedRoute>
      }
      key="profile"
    />,
  ];
}

function getAdminRoutes() {
  return [
    <Route
      path="/admin"
      element={
        <ProtectedRoute requiredRole="admin">
          <ListApartmentsComponentAdmin />
        </ProtectedRoute>
      }
      key="admin"
    />,
    <Route
      path="/admin/apartments"
      element={
        <ProtectedRoute requiredRole="admin">
          <ListApartmentsComponentAdmin />
        </ProtectedRoute>
      }
      key="admin-apartments"
    />,
    <Route
      path="/admin/add-apartment"
      element={
        <ProtectedRoute requiredRole="admin">
          <CreateOrUpdateApartmentComponent />
        </ProtectedRoute>
      }
      key="admin-add"
    />,
    <Route
      path="/admin/edit-apartment/:id"
      element={
        <ProtectedRoute requiredRole="admin">
          <CreateOrUpdateApartmentComponent />
        </ProtectedRoute>
      }
      key="admin-edit"
    />,
    <Route
      path="/admin/reservations"
      element={
        <ProtectedRoute requiredRole="admin">
          <ReservationsComponentAdmin />
        </ProtectedRoute>
      }
      key="admin-reservations"
    />,
    <Route
      path="/admin/email-templates"
      element={
        <ProtectedRoute requiredRole="admin">
          <EmailTemplatesComponent />
        </ProtectedRoute>
      }
      key="admin-templates"
    />,
  ];
}

function App() {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, "");
  const langMatch = location.pathname.split('/')[1];
  const supportedLangs = ['ua', 'ru', 'en'];
  const isValidLang = supportedLangs.includes(langMatch);
  const { lang } = useParams();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  if (location.pathname === "/") {
    i18n.changeLanguage('ua');
    return <Navigate to="/ua/" replace />;
  }

  return (
    <div className="wrapper">
      <HeaderComponent />
      <Routes>
        {getAdminRoutes()}
        {isValidLang ? getLocalizedRoutes() : <Route path="*" element={<MainComponent />} />}
      </Routes>
      {normalizedPath !== `/${langMatch}` && <FooterComponent />}
    </div>
  );
}

export default AppWrapper;