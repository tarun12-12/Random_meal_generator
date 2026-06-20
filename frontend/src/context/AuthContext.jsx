import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const API_URL = "https://mealify-backend-oke2.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Check token when app loads
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = res.headers.get("content-type");

      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const contentType = res.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Server returned non-JSON response: ${text}`);
    }

    if (!res.ok) {
      throw new Error(data.details || data.error || "Signup failed");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);

    return data;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const contentType = res.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Server returned non-JSON response: ${text}`);
    }

    if (!res.ok) {
      throw new Error(data.details || data.error || "Login failed");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);

    return data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  const authFetch = async (url, options = {}) => {
    return fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};