import { useEffect, useState } from "react";

export function useReviewReportData() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fakeReviews = [
      {
        id: "r1",
        reviewText: "Phòng sạch nhưng chủ nhà không thân thiện.",
        reportedBy: "Nguyễn Lan",
        reviewer: "Hoàng Minh",
        rating: 3.0,
        status: "pending",
      },
      {
        id: "r2",
        reviewText: "Đánh giá sai sự thật.",
        reportedBy: "Admin",
        reviewer: "Văn Tú",
        rating: 1.0,
        status: "approved",
      },
    ];
    setTimeout(() => {
      setReviews(fakeReviews);
      setLoading(false);
    }, 800);
  }, []);

  return { reviews, loading };
}
