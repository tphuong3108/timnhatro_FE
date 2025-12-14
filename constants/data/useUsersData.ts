import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";

export const useUsersData = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllUsers();

      const mappedUsers = (res || []).map((u: any) => ({
        ...u,
        isActive: !u.banned,
      }));

      setUsers(mappedUsers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await adminApi.toggleUserActive(id);
      await fetchUsers();
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, toggleActive };
};
