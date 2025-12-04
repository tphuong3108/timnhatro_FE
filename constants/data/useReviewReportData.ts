import { adminApi } from "@/services/adminApi";
import { useEffect, useState } from "react";

export function useReviewReportData() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReviewReports();

      setReviews(
        res.map((r: any) => ({
          id: r.id,
          reviewText: r.comment,
          reviewer: r.reviewerName,
          reviewerAvatar: r.reviewerAvatar,
          rating: r.rating,
          roomName: r.roomName,
          roomSlug: r.roomSlug,
          hostName: r.hostName,
          hostAvatar: r.hostAvatar,
          reports: r.reports, 
          status: "pending",
        }))
      );
    } catch (error) {
      console.error("Lỗi khi tải báo cáo review:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { reviews, loading, fetchReports };
}
