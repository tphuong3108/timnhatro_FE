export type Review = {
  _id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string; 
};
export type HostReview = {
  _id: string;
  reviewer: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
};
export type Host = {
  _id: string;
  fullName: string;
  avatar: string;
  bio?: string;
  email?: string;
  avgRating?: number;
  totalReviews?: number;
  hostReviews?: HostReview[];
};
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
  videos?: string[];
  host?: Host;
  reviews?: Review[]; 
  amenities?: string[]; 
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
      "https://i.pinimg.com/736x/3e/14/5b/3e145bd017d7afc6552248ad7fb99143.jpg",
      "https://i.pinimg.com/736x/99/61/de/9961dedbc854c8c2a54f5f3868681f47.jpg",
    ],
    videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    amenities: [
      "Wi-Fi miễn phí",
      "Điều hòa",
      "Máy giặt",
      "Khu bếp",
      "An ninh",
    ],
    host: {
      _id: "host1",
      fullName: "Tracy Nguyễn",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      bio: "Chủ nhà siêu cấp với 60+ đánh giá tích cực.",
      email: "tracy@example.com",
    },
    reviews: [
      {
        _id: "r1",
        user: {
          name: "Ngọc Thiên Quỳnh",
          avatar: "https://randomuser.me/api/portraits/women/52.jpg",
        },
        rating: 5,
        comment:
          "Chị host rất dễ thương và phản hồi tin nhắn rất nhanh luôn ạ. Phòng rất sạch sẽ như hình, vị trí rất tiện lợi, ngay trung tâm và dễ dàng di chuyển. Mình sẽ quay lại nếu có dịp!",
        date: "2 tuần trước",
      },
      {
        _id: "r2",
        user: {
          name: "Thương",
          avatar: "https://randomuser.me/api/portraits/women/46.jpg",
        },
        rating: 4,
        comment:
          "Vị trí siêu ok luôn ngay gần khu phố cổ, tối khá nhộn nhịp. Dù thế nhưng khi lên phòng thì không hề ồn ào, tách biệt và yên tĩnh. Phòng hơi nhỏ một chút nhưng rất sạch sẽ.",
        date: "1 tháng trước",
      },
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
      "https://i.pinimg.com/736x/43/80/52/438052acbf98fdd8faba02ec20960f61.jpg",
      "https://i.pinimg.com/736x/3e/14/5b/3e145bd017d7afc6552248ad7fb99143.jpg",
    ],
    videos: [],
   amenities: [
      "Wi-Fi miễn phí",
      "TV",
      "Tủ lạnh",
      "Chỗ để xe",
    ],
    host: {
      _id: "host2",
      fullName: "Nguyệt Cầm",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg",
      bio: "Thích chia sẻ không gian ấm cúng cho du khách.",
      email: "tracy@example.com",

    },
  },
];

export default rooms;
