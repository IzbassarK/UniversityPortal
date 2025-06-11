"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  error: string | null;
  updateUserProfile: (profileData: { firstName: string; lastName: string; email: string; username: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}
export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Authentication error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname.startsWith("/auth") || pathname === "/"

      if (!user && !isAuthRoute) {
        // Redirect to login if not authenticated and not on an auth route
        router.push("/auth/login")
      } else if (user && isAuthRoute && pathname !== "/") {
        // Redirect to dashboard if authenticated and on an auth route (except homepage)
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка входа");
  
      // Save the full user object in localStorage
      localStorage.setItem("user", JSON.stringify(data.user)); 
  
      // Also save user id separately for easy access
      localStorage.setItem("user_id", data.user.id); 
  
      // Save tokens
      localStorage.setItem("tokens", JSON.stringify(data.tokens));
  
      setUser(data.user);  // set context user to user object
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  

  // 📝 Функция для регистрации
  const signup = async ({ email, password, firstName, lastName }: SignupData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка регистрации");

      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        profileImage: data.user.profile_image,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("tokens", JSON.stringify(data.tokens));
      
      setUser(userData);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Функция для выхода
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    setUser(null);
    router.push("/login");
  };

  const updateUserProfile = async (profileData: { firstName: string; lastName: string; email: string; username: string }) => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      const username = profileData.username; // Используем username
  
      const res = await fetch(`http://127.0.0.1:8000/api/user-details/${username}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(profileData),
      });
      
      //profileData.username=username
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка обновления профиля");
      await getUserProfile();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Ошибка:", err.message);
      } else {
        console.error("Неизвестная ошибка:", err);
      }
      throw err;
    }
  };
  
  const getUserProfile = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
  
      const res = await fetch("http://127.0.0.1:8000/api/user-details/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });
  
      if (!res.ok) throw new Error("Ошибка загрузки профиля");
  
      const userData = await res.json();

      

      
      // ✅ Обновляем контекст и localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
  
    } catch (err) {
      console.error("Ошибка загрузки профиля:", err);
    }
  };

  // 🔑 Обновление пароля
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      const res = await fetch("http://127.0.0.1:8000/api/user/password/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка обновления пароля");
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        error,
        updateUserProfile,
        updatePassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
