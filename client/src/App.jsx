import { Link, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Meals from './pages/Meals.jsx';
import Profile from './pages/Profile.jsx';
import Planner from './pages/Planner.jsx';
import './styles.css';

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand"><span className="brand-mark">N</span> NutriEase</Link>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/meals">Explore meals</NavLink>
        <NavLink to="/profile">My preferences</NavLink>
        <NavLink to="/planner" className="nav-cta">AI meal planner</NavLink>
      </nav>
    </header>
  );
}

function NotFound() {
  return <main className="container section"><h1>Page not found</h1><Link className="button" to="/">Back home</Link></main>;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="footer">
        <div className="container footer-inner">
          <span className="brand"><span className="brand-mark">N</span> NutriEase</span>
          <span>Small steps. Better meals. Busy-life friendly.</span>
        </div>
      </footer>
    </>
  );
}
