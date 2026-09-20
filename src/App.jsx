import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SchemeList from './pages/SchemeList';
import SchemeDetail from './pages/SchemeDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Categories from './pages/Categories';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import EligibilityChecker from './pages/EligibilityChecker';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import EligibilityWizardModal from './components/schemes/EligibilityWizardModal';
import Error401 from './components/errors/Error401';
import Error403 from './components/errors/Error403';
import Error404 from './components/errors/Error404';
import Error500 from './components/errors/Error500';

const App = () => {
  const [showEligibilityWizard, setShowEligibilityWizard] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            {/* Top Navigation */}
            <Navbar onOpenEligibilityWizard={() => setShowEligibilityWizard(true)} />

            {/* Main Application Body */}
            <main className="flex-grow-1">
              <Routes>
                {/* Public Pages */}
                <Route
                  path="/"
                  element={<Home onOpenEligibilityWizard={() => setShowEligibilityWizard(true)} />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/eligibility-checker" element={<EligibilityChecker />} />
                <Route
                  path="/schemes"
                  element={<SchemeList onOpenEligibilityWizard={() => setShowEligibilityWizard(true)} />}
                />
                <Route
                  path="/schemes/:id"
                  element={<SchemeDetail onOpenEligibilityWizard={() => setShowEligibilityWizard(true)} />}
                />

                {/* Protected Citizen Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard onOpenEligibilityWizard={() => setShowEligibilityWizard(true)} />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Officer / Admin Routes */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Error Pages */}
                <Route path="/401" element={<Error401 />} />
                <Route path="/403" element={<Error403 />} />
                <Route path="/404" element={<Error404 />} />
                <Route path="/500" element={<Error500 />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer onOpenEligibilityWizard={() => setShowEligibilityWizard(true)} />

            {/* AI Smart Scheme Eligibility Wizard Modal */}
            <EligibilityWizardModal
              show={showEligibilityWizard}
              onClose={() => setShowEligibilityWizard(false)}
            />

            {/* Global Toast Notification System */}
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
