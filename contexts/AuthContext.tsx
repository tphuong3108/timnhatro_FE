import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar:string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  (async () => {
    try {
      console.log("🔍 Đang load user từ AsyncStorage...");
      const data = await AsyncStorage.getItem("user");
      if (data) {
        console.log("✅ Có user trong storage");
        setUser(JSON.parse(data));
      } else {
        console.log("⚠️ Không có user trong AsyncStorage");
      }
    } catch (err) {
      console.error("❌ Lỗi load user:", err);
    } finally {
      console.log("✅ Set loading = false");
      setLoading(false);
    }
  })();
}, []);


  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
