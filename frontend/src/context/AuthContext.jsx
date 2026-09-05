import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user") || localStorage.getItem("adminUser");

    if (!savedUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      return parsedUser?.candidate || parsedUser?.admin || parsedUser;
    } catch (error) {
      console.error("Erreur utilisateur localStorage :", error);

      return null;
    }
  });

  const isAuthenticated = !!user && !!localStorage.getItem("token");

  const login = (token, userData) => {
    const normalizedUser = userData?.candidate || userData?.admin || userData;

    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");

    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
