import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import PageTransition from './components/PageTransition';
import FloatingContact from './components/FloatingContact';
import Sidebars from './components/Sidebars';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';

// Route-based lazy loading — each page is a separate chunk
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ServicesPage = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Works = lazy(() => import('./pages/Works'));
const WorkDetail = lazy(() => import('./pages/WorkDetail'));
const Careers = lazy(() => import('./pages/Careers'));
const CareerDetail = lazy(() => import('./pages/CareerDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Minimal route loading fallback — keeps the layout shell visible
function RouteLoadingFallback() {
  return null;
}

function AppContent() {
  const location = useLocation();

  return (
    <SmoothScroll>
      {/* Feature 47: Skip-to-content for keyboard/screen reader users */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <FloatingContact />
      <Sidebars />
      <main id="main-content">
        <Suspense fallback={<RouteLoadingFallback />}>
          <PageTransition>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Login />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/works" element={<Works />} />
              <Route path="/works/:slug" element={<WorkDetail />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/:slug" element={<CareerDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>
    </SmoothScroll>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <SiteConfigProvider>
          <AppContent />
        </SiteConfigProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
