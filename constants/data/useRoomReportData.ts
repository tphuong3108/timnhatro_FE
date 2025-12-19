import { adminApi } from "@/services/adminApi";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

export interface RoomReport {
  id: string;
  slug?: string;
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
          id: r._id || r.id || r.roomId,
          slug: r.slug,
          name: r.name || "Phòng chưa có tên",
          address: r.address || "Chưa rõ địa chỉ",
          image: r.images?.[0] || "/image.png",
          host: {
            name: r.hostName || "Không rõ",
            avatar: r.hostAvatar || "/user.png",
          },
          reporter: {
            name: r.reports?.[0]?.reporterName || "Ẩn danh",
            avatar: r.reports?.[0]?.reporterAvatar || "/user.png",
          },
          status: "pending" as const,
          views: r.viewCount || 0,
          likes: r.totalLikes || 0,
          rating: r.avgRating || 0,
          totalReviews: r.totalRatings || 0,
          reportContent: r.reports?.[0]?.reason || "Không có nội dung báo cáo cụ thể.",
          attachments: r.reports?.[0]?.images || [],
        })) || [];

      setRooms(mapped);
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (roomId: string) => {
    if (!roomId) return;
    try {
      await adminApi.processReports({ type: 'room', id: roomId, action: 'approve' });
    } catch (error) {
      // Silent fail - API có thể trả lỗi nhưng vẫn xử lý thành công
    } finally {
      await fetchReports();
    }
  };

  const handleReject = async (roomId: string) => {
    if (!roomId) return;
    try {
      await adminApi.processReports({ type: 'room', id: roomId, action: 'reject' });
    } catch (error) {
      // Silent fail - API có thể trả lỗi nhưng vẫn xử lý thành công
    } finally {
      await fetchReports();
    }
  };

  useEffect(() => {
    fetchReports();

    // Lắng nghe báo cáo mới từ socket để cập nhật realtime
    const handleNewReport = (data: { type: 'room' | 'review' }) => {
      if (data?.type === 'room') {
        fetchReports();
      }
    };

    socket.on('newReport', handleNewReport);

    return () => {
      socket.off('newReport', handleNewReport);
    };
  }, []);

  return { rooms, loading, fetchReports, handleApprove, handleReject };
}

