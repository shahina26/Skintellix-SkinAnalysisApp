import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

const Home        = lazy(() => import('./pages/Home'));
const SkinQuiz    = lazy(() => import('./pages/SkinQuiz'));
const Results     = lazy(() => import('./pages/Results'));
const Products    = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Makeup      = lazy(() => import('./pages/Makeup'));
const Compare     = lazy(() => import('./pages/Compare'));
const Blog        = lazy(() => import('./pages/Blog'));
const About       = lazy(() => import('./pages/About'));
const Login       = lazy(() => import('./pages/Login'));
const Register    = lazy(() => import('./pages/Register'));
const Dashboard   = lazy(() => import('./pages/Dashboard'));

const GenericPage = ({ title }) => (
  <div className="min-h-[70vh] bg-cream-50 pt-32 pb-20 px-4 text-center">
    <div className="max-w-2xl mx-auto card p-12">
      <h1 className="font-display text-4xl text-charcoal-950 mb-4">{title}</h1>
      <p className="text-charcoal-800/60 leading-relaxed">This page is currently being updated. Please check back later.</p>
    </div>
  </div>
);

export default function App() {
  const location = useLocation();
  const hideNav = ['/quiz', '/quiz/results'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/quiz"          element={<SkinQuiz />} />
            <Route path="/quiz/results"  element={<Results />} />
            <Route path="/products"      element={<Products />} />
            <Route path="/products/:id"  element={<ProductDetail />} />
            <Route path="/makeup"        element={<Makeup />} />
            <Route path="/compare"       element={<Compare />} />
            <Route path="/blog"          element={<Blog />} />
            <Route path="/about"         element={<About />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/privacy-policy" element={<GenericPage title="Privacy Policy" />} />
            <Route path="/terms-of-service" element={<GenericPage title="Terms of Service" />} />
            <Route path="/cookie-policy" element={<GenericPage title="Cookie Policy" />} />
            <Route path="/affiliate-disclosure" element={<GenericPage title="Affiliate Disclosure" />} />
            <Route path="/contact" element={<GenericPage title="Contact Us" />} />
            <Route path="*"             element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      {!hideNav && <Footer />}
    </div>
  );
}
