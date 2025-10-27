import { useEffect, useState } from "react";
import { RoomReport } from "./RoomReport";

export function useRoomReportData() {
  const [rooms, setRooms] = useState<RoomReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fakeRooms: RoomReport[] = [
      {
        id: "1",
        name: "Phòng studio Q.1",
        address: "123 Nguyễn Huệ, TP.HCM",
        image: "https://picsum.photos/300",
        host: { name: "Nguyễn Phương", avatar: "https://i.pravatar.cc/150?img=3" },
        status: "approved",
        views: 2456,
        likes: 230,
        rating: 4.8,
        totalReviews: 122,
      },
      {
        id: "2",
        name: "Phòng mini Gò Vấp",
        address: "12 Lê Đức Thọ, TP.HCM",
        image: "https://picsum.photos/301",
        host: { name: "Trần Long", avatar: "https://i.pravatar.cc/150?img=5" },
        status: "approved",
        views: 1987,
        likes: 180,
        rating: 4.3,
        totalReviews: 75,
      },
      {
        id: "3",
        name: "Phòng view Landmark 81",
        address: "25 Nguyễn Hữu Cảnh, TP.HCM",
        image: "https://picsum.photos/302",
        host: { name: "Minh Anh", avatar: "https://i.pravatar.cc/150?img=8" },
        status: "pending",
        views: 534,
        likes: 35,
        rating: 4.1,
        totalReviews: 22,
      },
    ];

    setTimeout(() => {
      setRooms(fakeRooms);
      setLoading(false);
    }, 800);
  }, []);

  return { rooms, loading };
}
