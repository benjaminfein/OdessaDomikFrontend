import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
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

function App() {
  const location = useLocation();

  return (
    <div className="wrapper">
        <HeaderComponent />
        <Routes>
          {/* Открытые маршруты */}
          <Route path="/" element={<MainComponent />} />
          <Route path="/apartments" element={<ListApartmentsComponentClient />} />
          <Route path="/apartments/:id/about" element={<AboutApartmentComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/apartments/apartment-details/:id" element={<AboutApartmentComponent />} />
          <Route path="/searching-results" element={<SearchingResultsComponent />} />
          <Route path="/apartments/:id/reservation" element={<ReservationComponent />} />
          <Route path="/about-us" element={<AboutUsComponent />} />

          {/* Защищённые маршруты */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <ListApartmentsComponentAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/apartments"
            element={
              <ProtectedRoute requiredRole="admin">
                <ListApartmentsComponentAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-apartment"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateOrUpdateApartmentComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-apartment/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateOrUpdateApartmentComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute requiredRole="admin">
                <ReservationsComponentAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/email-templates"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmailTemplatesComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
        {/* Скрываем футер на главной странице */}
        {location.pathname !== "/" && <FooterComponent />}
    </div>
  );
}

export default AppWrapper;
