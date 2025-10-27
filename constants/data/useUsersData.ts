import { useEffect, useState } from "react";
import { User } from "./User";

export function useUsersData() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập dữ liệu user
    const fakeUsers: User[] = [
      {
        id: "1",
        name: "Nguyễn Phương",
        email: "admin@gmail.com",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "admin",
        isActive: true,
        loginCount: 120,
        createdAt: "2024-08-15",
      },
      {
        id: "2",
        name: "Trần Quốc Hưng",
        email: "hung@gmail.com",
        avatar: "https://i.pravatar.cc/150?img=4",
        role: "host",
        isActive: true,
        loginCount: 88,
        createdAt: "2025-01-02",
      },
      {
        id: "3",
        name: "Phạm Kiệt",
        email: "kiet@gmail.com",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "user",
        isActive: false,
        loginCount: 15,
        createdAt: "2025-03-01",
      },
    ];

    setTimeout(() => {
      setUsers(fakeUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  return { users, loading, toggleActive };
}
