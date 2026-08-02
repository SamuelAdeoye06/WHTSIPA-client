import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, matchPath, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { hideDefaultBubble, autoHideOnClose, setTidioVisitor } from './utils/tidio'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import Threats from './pages/Threats'
import ThreatsTools from './pages/ThreatsTools'
import Report from './pages/Report'
import ThreatDetail from './pages/ThreatDetail'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import About from './pages/About'
import AboutOfficials from './pages/AboutOfficials'
import Contact from './pages/Contact'
import EssentialEight from './pages/EssentialEight'
import ForVictimsGovernment from './pages/ForVictimsGovernment'
import Blog from './pages/Blog'
import VerifyOtp from './pages/VerifyOtp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminReports from './pages/admin/AdminReports'
import AdminReportDetail from './pages/admin/AdminReportDetail'
import AdminTickets from './pages/admin/AdminTickets'
import AdminTicketDetail from './pages/admin/AdminTicketDetail'
import AdminBookings from './pages/admin/AdminBookings'
import AdminBookingDetail from './pages/admin/AdminBookingDetail'
import AdminContactMessages from './pages/admin/AdminContactMessages'
import AdminContactMessageDetail from './pages/admin/AdminContactMessageDetail'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'
import './styles/cyber.css'

const KNOWN_ROUTES = [
  '/', '/threats', '/threats/:slug', '/report',
  '/signin', '/signup', '/verify-otp',
  '/about', '/about-officials', '/contact',
  '/essential-eight', '/for-victims-government', '/blog', '/threats-tools',
  '/recover'
]
const BARE_ROUTES = ['/signin', '/signup', '/verify-otp']

function Layout() {
  const location = useLocation()
  const { user } = useAuth()

  // Hide Tidio's own floating bubble once on load — the app already has its
  // own "Chat with an Active Representative" entry points on Threats,
  // Contact, and Report, so a second floating bubble would be redundant.
  useEffect(() => {
    hideDefaultBubble()
    autoHideOnClose()
  }, [])

  // Once a user is signed in, pass their name/email into Tidio so the human
  // rep sees who they're talking to instead of an anonymous visitor.
  useEffect(() => {
    if (user) setTidioVisitor({ name: user.firstName || user.name, email: user.email })
  }, [user])

  const isKnownRoute = KNOWN_ROUTES.some(pattern =>
    matchPath({ path: pattern, end: true }, location.pathname)
  )
  const isBare = BARE_ROUTES.includes(location.pathname) || !isKnownRoute
  const isThreatsPage = location.pathname === '/threats' ||
    location.pathname.startsWith('/threats/')
    // Admin panel has its own sidebar shell — never show the public navbar/footer there
  const isAdminPage = location.pathname === '/admin' || location.pathname.startsWith('/admin/')
  const isDarkTheme = isThreatsPage

  return (
    <div className={isDarkTheme ? 'site-shell site-dark' : 'site-shell site-light'}>
      <ScrollManager />
      {!isBare && <Navbar />}
      <main>
        <Routes>
          <Route path="/"                       element={<Home />} />
          <Route path="/threats"                element={<Threats />} />
          <Route path="/threats/:slug"          element={<ThreatDetail />} />
          <Route path="/report"                 element={<Report />} />
          <Route path="/signin"                 element={<SignIn />} />
          <Route path="/signup"                 element={<SignUp />} />
          <Route path="/verify-otp"             element={<VerifyOtp />} />
          <Route path="/forgot-password"        element={<ForgotPassword />} />
          <Route path="/reset-password"         element={<ResetPassword />} />
          <Route path="/about"                  element={<About />} />
          <Route path="/about-officials"        element={<AboutOfficials />} />
          <Route path="/contact"                element={<Contact />} />
          <Route path="/essential-eight"        element={<EssentialEight />} />
          <Route path="/for-victims-government" element={<ForVictimsGovernment />} />
          <Route path="/blog"                   element={<Blog />} />
          <Route path="/threats-tools" element={<Navigate to="/threats" replace />} />
          <Route path="/recover"                element={<Navigate to="/report" state={{ scrollTo: 'recover' }} replace />} />
          {/* ── Admin panel (parent/child routing — AdminLayout gates on user.role === 'admin') ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index                          element={<AdminOverview />} />
            <Route path="reports"                 element={<AdminReports />} />
            <Route path="reports/:id"             element={<AdminReportDetail />} />
            <Route path="tickets"                 element={<AdminTickets />} />
            <Route path="tickets/:id"              element={<AdminTicketDetail />} />
            <Route path="bookings"                element={<AdminBookings />} />
            <Route path="bookings/:id"             element={<AdminBookingDetail />} />
            <Route path="contact-messages"        element={<AdminContactMessages />} />
            <Route path="contact-messages/:id"    element={<AdminContactMessageDetail />} />
            <Route path="users"                   element={<AdminUsers />} />
            <Route path="settings"                element={<AdminSettings />} />
          </Route>

          <Route path="*"                       element={<NotFound />} />
        </Routes>
      </main>
      {!isBare && !isThreatsPage && !isAdminPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App