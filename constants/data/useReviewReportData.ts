import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";

export interface ReviewReport {
  id: string;
  reviewText: string;
  reportedBy: string;
  reporterAvatar: string;
  reviewer: string;
  roomName: string;
  roomSlug: string;
  hostName: string;
  hostAvatar: string;
  rating: number;
  status: "approved" | "pending" | "rejected";
}

export function useReviewReportData() {
  const [reviews, setReviews] = useState<ReviewReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReportStats();

      const mapped =
        (res?.reportedReviews || [])
          .filter((r: any) => r && typeof r === "object")
          .map((r: any) => ({
            id: r._id,
            roomSlug: r.roomSlug || "",
            reviewText: r.comment || "Không có nội dung đánh giá",
            reportedBy: r.reports?.[0]?.reporterName || "Ẩn danh",
            reporterAvatar:
              r.reports?.[0]?.reporterAvatar ||
              "https://i.pravatar.cc/150?img=9",
            reviewer: r.reviewerName || "Không rõ người đánh giá",
            roomName: r.roomName || "Phòng chưa có tên",
            hostName: r.hostName || "Không rõ",
            hostAvatar:
              r.hostAvatar || "https://i.pravatar.cc/150?img=8",
            rating: r.avgRating || 0,
            status: "pending",
          })) || [];

      setReviews(mapped);
    } catch (error) {
      console.error(" Lỗi khi tải báo cáo review:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { reviews, loading, fetchReports };
}
