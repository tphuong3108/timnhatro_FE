import { useEffect, useState } from "react";
import { PostRoom } from "./PostRoom";

export function usePostsData() {
  const [posts, setPosts] = useState<PostRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fakeData: PostRoom[] = [
      {
        id: "1",
        name: "Phòng studio Q.1",
        address: "123 Nguyễn Huệ, TP.HCM",
        image: "https://picsum.photos/300",
        host: {
          name: "Nguyễn Phương",
          email: "admin@gmail.com",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        createdAt: "2025-10-20",
        status: "pending",
      },
      {
        id: "2",
        name: "Phòng mini Gò Vấp",
        address: "12 Lê Đức Thọ, TP.HCM",
        image: "https://picsum.photos/301",
        host: {
          name: "Trần Hưng",
          email: "hung@gmail.com",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
        createdAt: "2025-10-21",
        status: "pending",
      },
    ];

    setTimeout(() => {
      setPosts(fakeData);
      setLoading(false);
    }, 1000);
  }, []);

  const approvePost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
  };

  const rejectPost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
    );
  };

  return { posts, loading, approvePost, rejectPost };
}
