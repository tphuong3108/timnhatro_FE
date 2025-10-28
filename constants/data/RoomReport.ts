export interface RoomReport {
  id: string;
  name: string;
  address: string;
  image: string;
  host: {
    name: string;
    avatar: string;
  };
  status: "pending" | "approved" | "rejected";
  views: number;
  likes: number;
  rating: number;
  totalReviews: number;
  reportContent: string;
  attachments: string[];  
}
