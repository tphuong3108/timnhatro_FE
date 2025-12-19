import { adminApi } from "@/services/adminApi";
import { socket } from "@/utils/socket";
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
          id: r._id || r.id,
          reviewText: r.comment,
          reviewer: r.reviewerName,
          reviewerAvatar: r.reviewerAvatar,
          rating: r.rating,
          roomName: r.roomName,
          roomSlug: r.roomSlug,
          hostName: r.hostName,
          hostAvatar: r.hostAvatar,
          reports: r.reports,
          status: "pending" as const,
        }))
      );
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    if (!reviewId) return;
    try {
      await adminApi.processReports({ type: 'review', id: reviewId, action: 'approve' });
    } catch (error) {
      // Silent fail
    } finally {
      await fetchReports();
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!reviewId) return;
    try {
      await adminApi.processReports({ type: 'review', id: reviewId, action: 'reject' });
    } catch (error) {
      // Silent fail
    } finally {
      await fetchReports();
    }
  };

  useEffect(() => {
    fetchReports();

    const handleNewReport = (data: { type: 'room' | 'review' }) => {
      if (data?.type === 'review') {
        fetchReports();
      }
    };

    socket.on('newReport', handleNewReport);

    return () => {
      socket.off('newReport', handleNewReport);
    };
  }, []);

  return { reviews, loading, fetchReports, handleApprove, handleReject };
}

