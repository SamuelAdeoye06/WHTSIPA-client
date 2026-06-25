import { BrowserRouter, Routes, Route, useLocation, matchPath, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import './styles/cyber.css'

const KNOWN_ROUTES = [
  '/', '/threats', '/threats/:slug', '/report',
  '/signin', '/signup',
  '/about', '/about-officials', '/contact',
  '/essential-eight', '/for-victims-government', '/blog', '/threats-tools'
]
const BARE_ROUTES = ['/signin', '/signup']

function Layout() {
  const location = useLocation()
  const isKnownRoute = KNOWN_ROUTES.some(pattern =>
    matchPath({ path: pattern, end: true }, location.pathname)
  )
  const isBare = BARE_ROUTES.includes(location.pathname) || !isKnownRoute
  const isThreatsPage = location.pathname === '/threats' ||
    location.pathname.startsWith('/threats/')
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
          <Route path="/verify-email"           element={<VerifyEmail />} />
          <Route path="/forgot-password"        element={<ForgotPassword />} />
          <Route path="/reset-password"         element={<ResetPassword />} />
          <Route path="/about"                  element={<About />} />
          <Route path="/about-officials"        element={<AboutOfficials />} />
          <Route path="/contact"                element={<Contact />} />
          <Route path="/essential-eight"        element={<EssentialEight />} />
          <Route path="/for-victims-government" element={<ForVictimsGovernment />} />
          <Route path="/blog"                   element={<Blog />} />
          <Route path="/threats-tools" element={<Navigate to="/threats" replace />} />
          <Route path="*"                       element={<NotFound />} />
        </Routes>
      </main>
      {!isBare && !isThreatsPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Comment the line below to disable the app while client payment is pending */}
        {/* <Layout /> */}

        {/* Uncomment the block below to show the payment/maintenance screen */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3.5rem',
            marginBottom: '20px'
          }}>⏳</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '10px',
            color: '#38bdf8'
          }}>System Temporary Lock</h1>
          {/* <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            maxWidth: '480px',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            This demonstration environment is temporarily locked pending deployment confirmation. Please check back shortly or contact the administrator.
          </p> */}
          {/* <div style={{
            fontSize: '0.8rem',
            color: '#64748b',
            borderTop: '1px solid #1e293b',
            paddingTop: '20px',
            width: '100%',
            maxWidth: '300px'
          }}>
            Status Code: 402 - Payment Required
          </div> */}
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
