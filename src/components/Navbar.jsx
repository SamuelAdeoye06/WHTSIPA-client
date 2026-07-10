import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoWhts from '../assets/media/logo-whts.jpg'
import logoWhtsDark from '../assets/media/logo-whts-dark.png'
import { THREAT_DATA } from '../data/threatData'
import './Navbar.css'

/* ── Build a flat search index from threatData ── */
const SEARCH_INDEX = [
  { title: 'Home', desc: 'Cybersecurity intelligence platform — protect yourself online', path: '/' },
  { title: 'Threats', desc: 'Browse all cyber threat categories and scenarios', path: '/threats' },
  { title: 'Report an Incident', desc: 'Submit a cybercrime or scam report', path: '/report' },
  { title: 'About WHTSIPA', desc: 'Learn who we are, our mission and government alignment', path: '/about' },
  { title: 'The Officials', desc: 'Meet the team and cybersecurity partners', path: '/about-officials' },
  { title: 'For Victims & Government', desc: 'Guidance for victims and government agencies', path: '/for-victims-government' },
  { title: 'Essential Eight', desc: 'The essential eight cybersecurity strategies', path: '/essential-eight' },
  { title: 'Knowledge Base', desc: 'Articles, tips and awareness resources', path: '/blog' },
  { title: 'Contact Us', desc: 'Get in touch with the WHTSIPA team', path: '/contact' },
  { title: 'Recover Now', desc: 'Start your asset and identity recovery process', path: '/report' },
  { title: 'Book a Call Session', desc: 'Schedule a call session with our cybersecurity specialists', path: '/essential-eight?bookCall=true' },
  { title: 'Live Support Chat', desc: 'Open secure live support chat to speak with our representatives', path: '/contact?chat=true' },
  { title: 'Spot a Scam Quiz', desc: 'Test your scam detection skills and identify security threats', path: '/threats#spot-a-threat' },
  { title: 'Threat Library', desc: 'Explore common cyber threats, vectors and countermeasures', path: '/threats#types-of-threats' },
  { title: 'Patch Applications', desc: 'Essential Eight strategy: Keep applications updated and patched to mitigate vulnerabilities', path: '/essential-eight' },
  { title: 'Patch Operating Systems', desc: 'Essential Eight strategy: Ensure all operating systems run the latest secure patches', path: '/essential-eight' },
  { title: 'Multi-Factor Authentication', desc: 'Essential Eight strategy: Secure accounts and systems with robust MFA controls', path: '/essential-eight' },
  { title: 'Restrict Admin Privileges', desc: 'Essential Eight strategy: Limit administrative access and credentials', path: '/essential-eight' },
  { title: 'Application Control', desc: 'Essential Eight strategy: Prevent unauthorised and malicious software execution', path: '/essential-eight' },
  { title: 'Restrict Microsoft Office Macros', desc: 'Essential Eight strategy: Disable or control macros to prevent malware infection', path: '/essential-eight' },
  { title: 'User Application Hardening', desc: 'Essential Eight strategy: Configure software settings to reduce attack surface', path: '/essential-eight' },
  { title: 'Regular Backups', desc: 'Essential Eight strategy: Maintain clean, offline and tested data backups', path: '/essential-eight' },
  { title: 'Recovery', desc: 'Access guided recovery steps for digital security incidents', path: '/recover' },
  ...Object.entries(THREAT_DATA || {}).map(([slug, t]) => ({
    title: t.title || '',
    desc: t.overview ? t.overview.slice(0, 100) : '',
    path: `/threats/${slug}`,
  })).filter(t => t.title),
]

/* ── All 133 Google Translate languages (Abkhaz → Zulu) ── */
const LANGUAGES = [
  { code: 'AB',  name: 'Abkhaz',               native: 'аҧсуа'             },
  { code: 'ACE', name: 'Acehnese',              native: 'Acèh'              },
  { code: 'ACH', name: 'Acholi',                native: 'Acoli'             },
  { code: 'AF',  name: 'Afrikaans',             native: 'Afrikaans'         },
  { code: 'SQ',  name: 'Albanian',              native: 'Shqip'             },
  { code: 'ALZ', name: 'Alur',                  native: 'Alur'              },
  { code: 'AM',  name: 'Amharic',               native: 'አማርኛ'              },
  { code: 'AR',  name: 'Arabic',                native: 'العربية'           },
  { code: 'HY',  name: 'Armenian',              native: 'Հայերեն'           },
  { code: 'AS',  name: 'Assamese',              native: 'অসমীয়া'            },
  { code: 'AV',  name: 'Avar',                  native: 'авар'              },
  { code: 'AW',  name: 'Awadhi',                native: 'अवधी'              },
  { code: 'AY',  name: 'Aymara',                native: 'Aymar'             },
  { code: 'AZ',  name: 'Azerbaijani',           native: 'Azərbaycan'        },
  { code: 'BAN', name: 'Balinese',              native: 'Bali'              },
  { code: 'BA',  name: 'Bashkir',               native: 'Башҡорт'           },
  { code: 'EU',  name: 'Basque',                native: 'Euskara'           },
  { code: 'BE',  name: 'Belarusian',            native: 'Беларуская'        },
  { code: 'BEM', name: 'Bemba',                 native: 'Ichibemba'         },
  { code: 'BN',  name: 'Bengali',               native: 'বাংলা'             },
  { code: 'BEW', name: 'Betawi',                native: 'Betawi'            },
  { code: 'BHO', name: 'Bhojpuri',              native: 'भोजपुरी'           },
  { code: 'BS',  name: 'Bosnian',               native: 'Bosanski'          },
  { code: 'BR',  name: 'Breton',                native: 'Brezhoneg'         },
  { code: 'BG',  name: 'Bulgarian',             native: 'Български'         },
  { code: 'BUA', name: 'Buryat',                native: 'буряад'            },
  { code: 'CA',  name: 'Catalan',               native: 'Català'            },
  { code: 'CEB', name: 'Cebuano',               native: 'Cebuano'           },
  { code: 'NY',  name: 'Chichewa',              native: 'Chichewa'          },
  { code: 'ZH',  name: 'Chinese (Simplified)',  native: '中文(简体)'         },
  { code: 'ZHT', name: 'Chinese (Traditional)', native: '中文(繁體)'         },
  { code: 'CV',  name: 'Chuvash',               native: 'Чӑваш'             },
  { code: 'CO',  name: 'Corsican',              native: 'Corsu'             },
  { code: 'HR',  name: 'Croatian',              native: 'Hrvatski'          },
  { code: 'CS',  name: 'Czech',                 native: 'Čeština'           },
  { code: 'DA',  name: 'Danish',                native: 'Dansk'             },
  { code: 'DV',  name: 'Divehi',                native: 'ދިވެހި'             },
  { code: 'DOI', name: 'Dogri',                 native: 'डोगरी'             },
  { code: 'NL',  name: 'Dutch',                 native: 'Nederlands'        },
  { code: 'DZ',  name: 'Dzongkha',              native: 'རྫོང་ཁ'            },
  { code: 'EN',  name: 'English',               native: 'English'           },
  { code: 'EO',  name: 'Esperanto',             native: 'Esperanto'         },
  { code: 'ET',  name: 'Estonian',              native: 'Eesti'             },
  { code: 'EWE', name: 'Ewe',                   native: 'Eʋegbe'            },
  { code: 'FO',  name: 'Faroese',               native: 'Føroyskt'          },
  { code: 'FIJ', name: 'Fijian',                native: 'Vakaviti'          },
  { code: 'FIL', name: 'Filipino',              native: 'Filipino'          },
  { code: 'FI',  name: 'Finnish',               native: 'Suomi'             },
  { code: 'FR',  name: 'French',                native: 'Français'          },
  { code: 'FY',  name: 'Frisian',               native: 'Frysk'             },
  { code: 'FF',  name: 'Fula',                  native: 'Fulfulde'          },
  { code: 'GL',  name: 'Galician',              native: 'Galego'            },
  { code: 'KA',  name: 'Georgian',              native: 'ქართული'           },
  { code: 'DE',  name: 'German',                native: 'Deutsch'           },
  { code: 'EL',  name: 'Greek',                 native: 'Ελληνικά'          },
  { code: 'GN',  name: 'Guarani',               native: 'Avañe\'ẽ'          },
  { code: 'GU',  name: 'Gujarati',              native: 'ગુજરાતી'            },
  { code: 'HT',  name: 'Haitian Creole',        native: 'Kreyòl Ayisyen'    },
  { code: 'HA',  name: 'Hausa',                 native: 'Hausa'             },
  { code: 'HAW', name: 'Hawaiian',              native: 'ʻŌlelo Hawaiʻi'    },
  { code: 'IW',  name: 'Hebrew',                native: 'עברית'             },
  { code: 'HIL', name: 'Hiligaynon',            native: 'Ilonggo'           },
  { code: 'HI',  name: 'Hindi',                 native: 'हिंदी'              },
  { code: 'HMN', name: 'Hmong',                 native: 'Hmong'             },
  { code: 'HU',  name: 'Hungarian',             native: 'Magyar'            },
  { code: 'IS',  name: 'Icelandic',             native: 'Íslenska'          },
  { code: 'IG',  name: 'Igbo',                  native: 'Asụsụ Igbo'        },
  { code: 'ILO', name: 'Ilocano',               native: 'Ilocano'           },
  { code: 'ID',  name: 'Indonesian',            native: 'Bahasa Indonesia'  },
  { code: 'GA',  name: 'Irish',                 native: 'Gaeilge'           },
  { code: 'IT',  name: 'Italian',               native: 'Italiano'          },
  { code: 'JA',  name: 'Japanese',              native: '日本語'              },
  { code: 'JV',  name: 'Javanese',              native: 'Jawa'              },
  { code: 'KN',  name: 'Kannada',               native: 'ಕನ್ನಡ'             },
  { code: 'KK',  name: 'Kazakh',                native: 'Қазақша'           },
  { code: 'KM',  name: 'Khmer',                 native: 'ភាសាខ្មែរ'          },
  { code: 'RW',  name: 'Kinyarwanda',           native: 'Ikinyarwanda'      },
  { code: 'KG',  name: 'Kongo',                 native: 'Kikongo'           },
  { code: 'KO',  name: 'Korean',                native: '한국어'              },
  { code: 'KRI', name: 'Krio',                  native: 'Krio'              },
  { code: 'KU',  name: 'Kurdish (Kurmanji)',     native: 'Kurdî'             },
  { code: 'CKB', name: 'Kurdish (Sorani)',       native: 'کوردی'             },
  { code: 'KY',  name: 'Kyrgyz',                native: 'Кыргызча'          },
  { code: 'LO',  name: 'Lao',                   native: 'ລາວ'               },
  { code: 'LA',  name: 'Latin',                 native: 'Latina'            },
  { code: 'LV',  name: 'Latvian',               native: 'Latviešu'          },
  { code: 'LN',  name: 'Lingala',               native: 'Lingála'           },
  { code: 'LT',  name: 'Lithuanian',            native: 'Lietuvių'          },
  { code: 'LG',  name: 'Luganda',               native: 'Oluganda'          },
  { code: 'LB',  name: 'Luxembourgish',         native: 'Lëtzebuergesch'    },
  { code: 'MK',  name: 'Macedonian',            native: 'Македонски'        },
  { code: 'MAI', name: 'Maithili',              native: 'मैथिली'            },
  { code: 'MG',  name: 'Malagasy',              native: 'Malagasy'          },
  { code: 'MS',  name: 'Malay',                 native: 'Bahasa Melayu'     },
  { code: 'ML',  name: 'Malayalam',             native: 'മലയാളം'            },
  { code: 'MT',  name: 'Maltese',               native: 'Malti'             },
  { code: 'MI',  name: 'Maori',                 native: 'Māori'             },
  { code: 'MR',  name: 'Marathi',               native: 'मराठी'             },
  { code: 'MAW', name: 'Meitei (Manipuri)',      native: 'মৈতৈলোন্'          },
  { code: 'MIN', name: 'Minang',                native: 'Minangkabau'       },
  { code: 'MNI', name: 'Mizo',                  native: 'Mizo ṭawng'        },
  { code: 'MN',  name: 'Mongolian',             native: 'Монгол'            },
  { code: 'MY',  name: 'Myanmar (Burmese)',      native: 'မြန်မာ'            },
  { code: 'NE',  name: 'Nepali',                native: 'नेपाली'             },
  { code: 'NO',  name: 'Norwegian',             native: 'Norsk'             },
  { code: 'OR',  name: 'Odia (Oriya)',           native: 'ଓଡ଼ିଆ'             },
  { code: 'OM',  name: 'Oromo',                 native: 'Afaan Oromoo'      },
  { code: 'PS',  name: 'Pashto',                native: 'پښتو'              },
  { code: 'FA',  name: 'Persian',               native: 'فارسی'             },
  { code: 'PL',  name: 'Polish',                native: 'Polski'            },
  { code: 'PT',  name: 'Portuguese',            native: 'Português'         },
  { code: 'PA',  name: 'Punjabi',               native: 'ਪੰਜਾਬੀ'            },
  { code: 'QU',  name: 'Quechua',               native: 'Runasimi'          },
  { code: 'RO',  name: 'Romanian',              native: 'Română'            },
  { code: 'RU',  name: 'Russian',               native: 'Русский'           },
  { code: 'SM',  name: 'Samoan',                native: 'Faa Samoa'         },
  { code: 'SA',  name: 'Sanskrit',              native: 'संस्कृतम्'          },
  { code: 'GD',  name: 'Scots Gaelic',          native: 'Gàidhlig'          },
  { code: 'NSO', name: 'Sepedi',                native: 'Sesotho sa Leboa'  },
  { code: 'SR',  name: 'Serbian',               native: 'Српски'            },
  { code: 'ST',  name: 'Sesotho',               native: 'Sesotho'           },
  { code: 'SN',  name: 'Shona',                 native: 'chiShona'          },
  { code: 'SD',  name: 'Sindhi',                native: 'سنڌي'              },
  { code: 'SI',  name: 'Sinhala',               native: 'සිංහල'             },
  { code: 'SK',  name: 'Slovak',                native: 'Slovenčina'        },
  { code: 'SL',  name: 'Slovenian',             native: 'Slovenščina'       },
  { code: 'SO',  name: 'Somali',                native: 'Soomaali'          },
  { code: 'ES',  name: 'Spanish',               native: 'Español'           },
  { code: 'SU',  name: 'Sundanese',             native: 'Basa Sunda'        },
  { code: 'SW',  name: 'Swahili',               native: 'Kiswahili'         },
  { code: 'SS',  name: 'Swati',                 native: 'SiSwati'           },
  { code: 'SV',  name: 'Swedish',               native: 'Svenska'           },
  { code: 'TG',  name: 'Tajik',                 native: 'Тоҷикӣ'            },
  { code: 'TA',  name: 'Tamil',                 native: 'தமிழ்'             },
  { code: 'TT',  name: 'Tatar',                 native: 'Татар'             },
  { code: 'TE',  name: 'Telugu',                native: 'తెలుగు'            },
  { code: 'TH',  name: 'Thai',                  native: 'ไทย'               },
  { code: 'TI',  name: 'Tigrinya',              native: 'ትግርኛ'              },
  { code: 'TS',  name: 'Tsonga',                native: 'Xitsonga'          },
  { code: 'TR',  name: 'Turkish',               native: 'Türkçe'            },
  { code: 'TK',  name: 'Turkmen',               native: 'Türkmençe'         },
  { code: 'TW',  name: 'Twi',                   native: 'Twi'               },
  { code: 'UK',  name: 'Ukrainian',             native: 'Українська'        },
  { code: 'UR',  name: 'Urdu',                  native: 'اردو'              },
  { code: 'UG',  name: 'Uyghur',                native: 'ئۇيغۇرچە'          },
  { code: 'UZ',  name: 'Uzbek',                 native: 'O\'zbek'           },
  { code: 'VI',  name: 'Vietnamese',            native: 'Tiếng Việt'        },
  { code: 'CY',  name: 'Welsh',                 native: 'Cymraeg'           },
  { code: 'XH',  name: 'Xhosa',                 native: 'isiXhosa'          },
  { code: 'YI',  name: 'Yiddish',               native: 'ייִדיש'             },
  { code: 'YO',  name: 'Yoruba',                native: 'Yorùbá'            },
  { code: 'ZU',  name: 'Zulu',                  native: 'isiZulu'           },
]

function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) { setResults([]); return }
    setResults(
      SEARCH_INDEX.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      ).slice(0, 8)
    )
  }, [query])

  const go = (path) => { navigate(path); onClose() }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <i className="bi bi-search search-modal-icon" />
          <input
            ref={inputRef}
            className="search-modal-input"
            placeholder="Search threats, topics, pages…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'Enter' && results.length > 0) go(results[0].path)
            }}
          />
          <button className="search-modal-close" onClick={onClose} aria-label="Close search">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        {results.length > 0 && (
          <ul className="search-results">
            {results.map((r, i) => (
              <li key={i}>
                <button className="search-result-item" onClick={() => go(r.path)}>
                  <span className="search-result-title">{r.title}</span>
                  {r.desc && <span className="search-result-desc">{r.desc}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
        {query.trim() && results.length === 0 && (
          <div className="search-no-results">No results for "<strong>{query}</strong>"</div>
        )}
        {!query.trim() && (
          <div className="search-hint">
            <span>Try: <button className="search-hint-tag" onClick={() => setQuery('phishing')}>phishing</button></span>
            <button className="search-hint-tag" onClick={() => setQuery('ransomware')}>ransomware</button>
            <button className="search-hint-tag" onClick={() => setQuery('report')}>report</button>
            <button className="search-hint-tag" onClick={() => setQuery('recovery')}>recovery</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [langOpen,   setLangOpen]   = useState(false)
  const [langSearch, setLangSearch] = useState('')
  const [activeLang, setActiveLang] = useState(LANGUAGES.find(l => l.code === 'EN'))
  const [showSignOutToast, setShowSignOutToast] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false); setLangSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { setNavOpen(false) }, [location])

  // Close search on Escape globally
  useEffect(() => {
    if (!searchOpen) return
    const handler = (e) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [searchOpen])

  const isAboutActive = location.pathname.startsWith('/about') || location.pathname === '/for-victims-government'
  const isResourcesActive = ['/essential-eight', '/blog'].includes(location.pathname)
  const isReportActive = location.pathname.startsWith('/report')
  const isDarkPage = location.pathname === '/threats' || location.pathname.startsWith('/threats/')

  const SearchBtn = ({ className = '' }) => (
    <button
      className={`nav-search-btn ${className}`}
      onClick={() => setSearchOpen(true)}
      aria-label="Search site"
      type="button"
    >
      <i className="bi bi-search" aria-hidden="true"></i>
      <span>Search</span>
    </button>
  )

  /* Shared language button — shows full name, opens the custom dropdown */
  const LangBtn = ({ className = '' }) => (
    <div className={`nav-lang-wrap ${className}`} style={{ position: 'relative' }} ref={langRef}>
      <button
        className="nav-lang-btn"
        onClick={() => setLangOpen(p => !p)}
        aria-label="Select language"
      >
        <i className="bi bi-translate me-1"></i>
        <span className="nav-lang-current">{activeLang.name}</span>
        <i className={`bi bi-chevron-${langOpen ? 'up' : 'down'} nav-lang-chevron`}></i>
      </button>
      {langOpen && (
        <div className="nav-lang-dropdown">
          <div className="nav-lang-search-wrap">
            <i className="bi bi-search nav-lang-search-icon"></i>
            <input
              className="nav-lang-search"
              placeholder="Search language…"
              value={langSearch}
              onChange={e => setLangSearch(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="nav-lang-list">
            {LANGUAGES.filter(l =>
              l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
              l.native.toLowerCase().includes(langSearch.toLowerCase())
            ).map(l => (
              <li key={l.code}>
                <button
                  className={`nav-lang-option${activeLang.code === l.code ? ' active' : ''}`}
                  onClick={() => { setActiveLang(l); setLangOpen(false); setLangSearch('') }}
                >
                  <span className="nav-lang-native">{l.native}</span>
                  <span className="nav-lang-name">{l.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  return (
    <>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {showSignOutToast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: '#0f172a', border: '1px solid #0d9488',
          borderRadius: '12px', padding: '0.85rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          animation: 'fadeInUp 0.25s ease',
        }}>
          <i className="bi bi-box-arrow-right" style={{ color: '#0d9488', fontSize: '1.1rem' }}></i>
          <span style={{ color: '#e9f3ff', fontWeight: 600, fontSize: '0.95rem' }}>
            You've been signed out successfully.
          </span>
        </div>
      )}

      <nav className={`navbar navbar-expand-lg cyber-navbar ${isDarkPage ? 'navbar-dark' : 'navbar-light navbar-white'}`}>
        <div className="container nav-inner">

          <Link className="navbar-brand" to="/" aria-label="WHTS home">
            <img src={isDarkPage ? logoWhtsDark : logoWhts} alt="The Watch Eyes - WHTS" className="brand-logo" />
          </Link>

          <div className="nav-top-actions">
            <div className="nav-primary-actions">
              <SearchBtn />
              <Link className="btn btn-report-cta btn-sm-nav" to="/report" state={{ scrollTo: 'report' }}>
                <i className="bi bi-shield-exclamation me-1"></i>Report
              </Link>
            </div>
            <div className="nav-utility-row">
              <LangBtn />
              <Link className="nav-utility-link" to="/contact">Contact us</Link>
              {user ? (
                <button className="nav-utility-link" type="button" onClick={() => {
                  logout()
                  setShowSignOutToast(true)
                  setTimeout(() => { setShowSignOutToast(false); navigate('/') }, 2200)
                }}>
                  Sign out
                </button>
              ) : (
                <>
                  <Link className="nav-utility-link" to="/signin">Sign in</Link>
                  <Link className="nav-utility-link" to="/signup">Sign up</Link>
                </>
              )}
            </div>
          </div>

          <div className="nav-mobile-left">
            <LangBtn className="nav-lang-mobile" />
            <button className="navbar-toggler border-0" type="button"
              aria-controls="mainNav" aria-expanded={navOpen}
              aria-label="Toggle navigation" onClick={() => setNavOpen(p => !p)}>
              <span className={`cyber-toggler-icon ${navOpen ? 'open' : ''}`}>
                <span /><span /><span />
              </span>
              <span className="nav-menu-label">Menu</span>
            </button>
          </div>

          <div className="nav-mobile-actions" aria-label="Quick actions">
            <Link className="btn btn-report-cta btn-sm-nav" to="/report" state={{ scrollTo: 'report' }}>
              <i className="bi bi-shield-exclamation me-1"></i>Report
            </Link>
            <SearchBtn />
          </div>

          <div className={`collapse navbar-collapse nav-menu-row ${navOpen ? 'show' : ''}`} id="mainNav">
            <ul className="navbar-nav mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
              <hr />
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/">Home</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link threats-link ${isActive ? 'active-link' : ''}`} to="/threats">Threats</NavLink>
              </li>

              <li className="nav-item dropdown">
                <a className={`nav-link dropdown-toggle nav-dropdown-toggle ${isAboutActive ? 'active-link' : ''}`}
                  href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  About
                  <span className="nav-underline" aria-hidden="true"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end cyber-dropdown p-3">
                  <li><Link className="dropdown-item cyber-dropdown-item" to="/about"><i className="bi bi-info-circle me-2" style={{ color: 'var(--cyan)' }}></i>About WHTSIPA</Link></li>
                  <li><Link className="dropdown-item cyber-dropdown-item" to="/about-officials"><i className="bi bi-people me-2" style={{ color: 'var(--cyan)' }}></i>The Officials</Link></li>
                  <li><Link className="dropdown-item cyber-dropdown-item" to="/for-victims-government"><i className="bi bi-heart me-2" style={{ color: 'var(--red)' }}></i>For Victims &amp; Government</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className={`nav-link dropdown-toggle nav-dropdown-toggle ${isResourcesActive ? 'active-link' : ''}`}
                  href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Resources
                  <span className="nav-underline" aria-hidden="true"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end cyber-dropdown p-3">
                  <li><Link className="dropdown-item cyber-dropdown-item" to="/essential-eight"><i className="bi bi-shield-check me-2" style={{ color: 'var(--green)' }}></i>Essential Eight</Link></li>
                  <li><Link className="dropdown-item cyber-dropdown-item" to="/blog"><i className="bi bi-newspaper me-2" style={{ color: 'var(--cyan)' }}></i>Knowledge Base</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className={`nav-link dropdown-toggle nav-dropdown-toggle ${isReportActive ? 'active-link' : ''}`}
                  href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Report &amp; Recover
                  <span className="nav-underline" aria-hidden="true"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end cyber-dropdown p-3">
                  <li><Link className="dropdown-item cyber-dropdown-item" to="/report" state={{ scrollTo: 'report' }}><i className="bi bi-exclamation-triangle me-2 text-danger"></i>Report Incident</Link></li>
                  <li><Link className="dropdown-item cyber-dropdown-item" to="/report" state={{ scrollTo: 'recover' }}><i className="bi bi-shield-check me-2 text-success"></i>Recover Now</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/contact">Contact</NavLink>
              </li>

            </ul>

            <div className="nav-auth-actions">
              {user ? (
                <div className="nav-mobile-auth">
                  <span className="nav-mobile-user">
                    <i className="bi bi-person-circle me-2"></i>
                    {user.firstName || user.email || 'Account'}
                  </span>
                  <button
                    className="nav-mobile-signout"
                    type="button"
                    onClick={() => {
                      logout()
                      setNavOpen(false)
                      setShowSignOutToast(true)
                      setTimeout(() => { setShowSignOutToast(false); navigate('/') }, 2200)
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                  </button>
                </div>
              ) : (
                <div className="nav-mobile-auth">
                  <Link className="nav-mobile-signin" to="/signin" onClick={() => setNavOpen(false)}>
                    <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </Link>
                  <Link className="nav-mobile-signup" to="/signup" onClick={() => setNavOpen(false)}>
                    <i className="bi bi-person-plus me-2"></i>Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}