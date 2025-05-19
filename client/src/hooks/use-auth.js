import { useQuery } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading,
    error,
    data: user,
  } = useQuery({
    queryKey: ["/api/auth/me"],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const value = {
    isLoading,
    error,
    user,
    isModalOpen,
    setIsModalOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}