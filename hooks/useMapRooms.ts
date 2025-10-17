import { useState } from "react";
import rooms, { Room } from "@/constants/data/rooms";

export function useMapRooms() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const selectRoom = (id: string) => {
    const room = rooms.find((r) => r._id === id) || null;
    setSelectedRoom(room);
  };

  return { rooms, selectedRoom, selectRoom };
}
