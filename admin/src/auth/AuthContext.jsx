
import { createContext, useState, useEffect, useContext } from "react"; // Added useContext here
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

// Manual JWT decoder function
const decodeJWT = (token) => {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload part
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    let isAuthenticated = false;
    if (token) {
      const decoded = decodeJWT(token);
      isAuthenticated = decoded && decoded.exp * 1000 > Date.now();
    }
    
    return {
      token,
      user,
      isAuthenticated: !!token,
      isLoading: false,
      isAdmin: user?.role === 'admin'
    };
  });

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    
    const decoded = decodeJWT(token);
    const isAdmin = userData?.role === 'admin';
    
    setAuthState({
      token,
      user: userData,
      isAuthenticated: true,
      isLoading: false,
      isAdmin
    });
    
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false
    });
    navigate("/login");
  };

  // Check token expiration periodically (every 5 minutes)
  useEffect(() => {
    if (!authState.token) return;
    
    const checkToken = () => {
      const decoded = decodeJWT(authState.token);
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        logout();
      }
    };
    
    checkToken(); // Initial check
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [authState.token]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};























