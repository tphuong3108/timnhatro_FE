// hooks/useMapRooms.ts
import { useRef, useState } from "react";
import MapView from "react-native-maps";
import rooms, { Room } from "@/constants/data/rooms";

export function useMapRooms() { 
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const mapRef = useRef<MapView>(null);

  const selectRoom = (id: string) => {
    const room = rooms.find((r) => r._id === id) || null;
    setSelectedRoom(room);
    if (room && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: room.latitude,
          longitude: room.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300
      );
    }
  };

  return { rooms, selectedRoom, selectRoom, mapRef };
}
