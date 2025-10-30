import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";

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

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReportStats(); 
        const mapped =
          res?.reportedRooms?.map((r: any) => ({
            id: r.slug,
            name: r.name || "Phòng chưa có tên",
            address: r.address || "Chưa rõ địa chỉ",
            image: r.images?.[0] || "https://via.placeholder.com/300",
            host: {
              name: r.hostName || "Không rõ",
              avatar: r.hostAvatar || "https://i.pravatar.cc/150?img=8",
            },
            reporter: {
              name: r.reports?.[0]?.reporterName || "Ẩn danh",
              avatar: r.reports?.[0]?.reporterAvatar || "https://i.pravatar.cc/150?img=9",
            },
            status: "pending",
            views: r.viewCount || 0,
            likes: r.totalLikes || 0,
            rating: r.avgRating || 0,
            totalReviews: r.totalRatings || 0,
            reportContent: r.reports?.[0]?.reason || "Không có nội dung báo cáo cụ thể.",
            attachments: r.reports?.[0]?.images || [],
          })) || [];

      setRooms(mapped);
    } catch (error) {
      console.error("❌ Lỗi khi tải báo cáo phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { rooms, loading, fetchReports };
}
