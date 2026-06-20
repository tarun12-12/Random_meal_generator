import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ImageProvider } from "./context/ImageContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Favorites from "./components/Favorites";
import History from "./components/History";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ImageProvider>
          <HashRouter>
            <div className="app-wrapper">
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </ImageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}