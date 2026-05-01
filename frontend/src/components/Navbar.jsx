import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import "../styled/navbar.css";

export default function Navbar() {
  const { toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav className="nav">
      <h2 className="nav-logo">DishFlash</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        {isAuthenticated && (
          <>
            <Link to="/favorites">Favorites</Link>
            <Link to="/history">History</Link>
            <Link to="/dashboard">Dashboard</Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {isAuthenticated ? (
          <div className="nav-user">
            <Link to="/dashboard" className="nav-user-link" title="My Account">
              <span className="nav-username">👤 {user?.name?.split(" ")[0]}</span>
            </Link>
            <button className="nav-logout" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-login-link">
            Login
          </Link>
        )}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          🌙
        </button>
      </div>
    </nav>
  );
}