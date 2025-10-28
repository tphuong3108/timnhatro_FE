import { useEffect, useState } from "react";

export interface RoomReport {
  id: string;
  name: string;
  address: string;
  image: string;
  host: {
    name: string;
    avatar: string;
  };
  reporter?: {
    name: string;
    avatar: string;
  };
  status: "approved" | "pending" | "rejected";
  views: number;
  likes: number;
  rating: number;
  totalReviews: number;
  reportContent?: string;
  attachments?: string[];
}

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
        host: {
          name: "Nguyễn Phương",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        reporter: {
          name: "Lê Thảo",
          avatar: "https://i.pravatar.cc/150?img=11",
        },
        status: "approved",
        views: 2456,
        likes: 230,
        rating: 4.8,
        totalReviews: 122,
        reportContent:
          "Phòng có dấu hiệu sai thông tin, hình ảnh không đúng thực tế. Cần xác minh lại thông tin để tránh gây hiểu lầm cho khách thuê.",
        attachments: [
          "https://picsum.photos/id/1011/400/300",
          "https://picsum.photos/id/1012/400/300",
        ],
      },
      {
        id: "2",
        name: "Phòng mini Gò Vấp",
        address: "12 Lê Đức Thọ, TP.HCM",
        image: "https://picsum.photos/301",
        host: {
          name: "Trần Long",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        reporter: {
          name: "Phạm Duy",
          avatar: "https://i.pravatar.cc/150?img=9",
        },
        status: "approved",
        views: 1987,
        likes: 180,
        rating: 4.3,
        totalReviews: 75,
        reportContent:
          "Giá phòng đăng khác với thực tế, cần xác minh thêm để đảm bảo tính minh bạch thông tin.",
        attachments: ["https://picsum.photos/id/1013/400/300"],
      },
      {
        id: "3",
        name: "Phòng view Landmark 81",
        address: "25 Nguyễn Hữu Cảnh, TP.HCM",
        image: "https://picsum.photos/302",
        host: {
          name: "Minh Anh",
          avatar: "https://i.pravatar.cc/150?img=8",
        },
        reporter: {
          name: "Ngọc Hà",
          avatar: "https://i.pravatar.cc/150?img=13",
        },
        status: "pending",
        views: 534,
        likes: 35,
        rating: 4.1,
        totalReviews: 22,
        reportContent:
          "Có dấu hiệu đăng lại phòng đã bị khóa trước đó. Cần kiểm tra để tránh spam hoặc lừa đảo.",
        attachments: [
          "https://picsum.photos/id/1014/400/300",
          "https://picsum.photos/id/1015/400/300",
        ],
      },
      {
        id: "4",
        name: "Phòng trọ sinh viên Thủ Đức",
        address: "45 Kha Vạn Cân, Thủ Đức, TP.HCM",
        image: "https://picsum.photos/304",
        host: {
          name: "Bích Ngọc",
          avatar: "https://i.pravatar.cc/150?img=7",
        },
        reporter: {
          name: "Hữu Thắng",
          avatar: "https://i.pravatar.cc/150?img=16",
        },
        status: "rejected",
        views: 1024,
        likes: 88,
        rating: 4.0,
        totalReviews: 40,
        reportContent:
          "Hình ảnh có vẻ cũ, tuy nhiên không có bằng chứng rõ ràng nên tạm từ chối báo cáo.",
        attachments: ["https://picsum.photos/id/1016/400/300"],
      },
    ];

    setTimeout(() => {
      setRooms(fakeRooms);
      setLoading(false);
    }, 800);
  }, []);

  return { rooms, loading };
}
