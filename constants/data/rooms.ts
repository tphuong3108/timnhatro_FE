export type Room = {
  _id: string;
  name: string;
  address: string;
  avgRating: number;
  totalRatings: number;
  price: number;
  latitude: number;
  longitude: number;
  images: string[];
};

const rooms: Room[] = [
  {
    _id: "1",
    name: "Bungalow tại Đà Lạt",
    address: "DreamlakeDal - Bungalow mộc mạc với bếp và vườn hoa",
    avgRating: 4.85,
    totalRatings: 82,
    price: 1353052,
    latitude: 11.9401,
    longitude: 108.4589,
    images: [
      "https://images.unsplash.com/photo-1600585154315-8cc1b6b1e8da",
      "https://images.unsplash.com/photo-1600585153930-9ccbb41c95d9",
      "https://images.unsplash.com/photo-1600585154207-6d47a3b0c5cd",
    ],
  },
  {
    _id: "2",
    name: "Nguyệt Cầm Apartment",
    address: "Phòng mini 1 giường, gần Hồ Xuân Hương, trung tâm Đà Lạt",
    avgRating: 4.73,
    totalRatings: 40,
    price: 600000,
    latitude: 11.9445,
    longitude: 108.4456,
    images: [
      "https://images.unsplash.com/photo-1600585153955-3aaf85f6e0b4",
      "https://images.unsplash.com/photo-1600585153965-94d8d73cae10",
    ],
  },
  {
    _id: "3",
    name: "Khách sạn tại Đà Lạt",
    address: "Phòng lớn cho cặp đôi gần chợ đêm, 1 giường queen",
    avgRating: 4.53,
    totalRatings: 19,
    price: 486000,
    latitude: 11.9385,
    longitude: 108.4468,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600585153909-012f3959d1e5",
    ],
  },
];

export default rooms;
