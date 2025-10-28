import { useEffect, useState } from "react";

export function useUsersData() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fakeUsers = [
      {
        id: "1",
        fullName: "Nguyễn Phương",
        email: "phuong@example.com",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "admin",
        isActive: true,
      },
      {
        id: "2",
        fullName: "Trần Long",
        email: "long@example.com",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "host",
        isActive: true,
      },
      {
        id: "3",
        fullName: "Minh Anh",
        email: "anh@example.com",
        avatar: "https://i.pravatar.cc/150?img=8",
        role: "user",
        isActive: false,
      },
    ];

    setTimeout(() => {
      setUsers(fakeUsers);
      setLoading(false);
    }, 800);
  }, []);

  const toggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return { users, loading, toggleActive };
}
