import { BrowserRouter, Routes, Route, useLocation, matchPath } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import Threats from './pages/Threats'
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
import './styles/cyber.css'

const KNOWN_ROUTES = [
  '/', '/threats', '/threats/:slug', '/report',
  '/signin', '/signup',
  '/about', '/about-officials', '/contact',
  '/essential-eight', '/for-victims-government', '/blog',
]
const BARE_ROUTES = ['/signin', '/signup']

function Layout() {
  const location = useLocation()
  const isKnownRoute = KNOWN_ROUTES.some(pattern =>
    matchPath({ path: pattern, end: true }, location.pathname)
  )
  const isBare = BARE_ROUTES.includes(location.pathname) || !isKnownRoute

  return (
    <>
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
          <Route path="/about"                  element={<About />} />
          <Route path="/about-officials"        element={<AboutOfficials />} />
          <Route path="/contact"                element={<Contact />} />
          <Route path="/essential-eight"        element={<EssentialEight />} />
          <Route path="/for-victims-government" element={<ForVictimsGovernment />} />
          <Route path="/blog"                   element={<Blog />} />
          <Route path="*"                       element={<NotFound />} />
        </Routes>
      </main>
      {!isBare && <Footer />}
    </>
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