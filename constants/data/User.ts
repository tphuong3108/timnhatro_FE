export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "host" | "admin";
  isActive: boolean;
  loginCount: number;
  createdAt: string;
}
