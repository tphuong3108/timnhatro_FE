// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "@/services/apiClient";

interface User {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: "tenant" | "host" | "admin" | "guest";
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
  login: (token: string, userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
  login: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const guestUser: User = {
    _id: "guest",
    firstName: "Guest",
    lastName: "",
    email: "",
    role: "guest",
    avatar: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
          setUser(guestUser);
        }
      } catch (error) {
        setUser(guestUser); 
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (token: string, userData: User) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(userData));

    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    delete apiClient.defaults.headers.Authorization;

    setUser(guestUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
