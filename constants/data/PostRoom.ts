export interface PostRoom {
  id: string;
  name: string;
  address: string;
  image: string;
  host: {
    name: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}
