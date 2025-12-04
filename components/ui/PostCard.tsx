import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Edit3, Trash2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/services/apiClient";

interface RoomCardProps {
  item: {
    slug?: string;
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    address?: string;
    distance?: string;
    image?: string;
    images?: string[];
    createdBy?: { _id: string } | string;
  };
  onDeleted?: () => void;
  showActions?: boolean; 
}

export default function PostCard({ item, onDeleted, showActions }: RoomCardProps) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  const imageUri =
    item.image ||
    item.images?.[0] ||
    "https://placehold.co/300x200?text=No+Image";
  const roomId = item._id || item.id;
  const slugOrId = item.slug || roomId;

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const createdById =
          typeof item.createdBy === "object"
            ? item.createdBy._id
            : item.createdBy;

        if (decoded.id === createdById || decoded._id === createdById) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (err) {
        console.log("Error decoding token:", err);
      }
    };
    checkOwner();
  }, [item]);

  const handleEdit = () => {
    if (!roomId)
      return Alert.alert("Error", "Room ID not found for editing.");
    router.push(`/(tabs)/room/edit/${roomId}`);
  };

  const handleDelete = async () => {
    if (!roomId)
      return Alert.alert("Error", "Room ID not found for deletion.");

    Alert.alert("Delete Room", "Are you sure you want to delete this room?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Error", "Please log in to delete the room.");
              return;
            }

            await apiClient.delete(`/hosts/rooms/${roomId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("Success", "Room has been deleted!");
            onDeleted?.();
          } catch (err: any) {
            console.log("Error deleting room:", err?.response?.data || err);
            Alert.alert("Error", "Could not delete the room, please try again.");
          }
        },
      },
    ]);
  };

  // Handle viewing the room details
  const handleViewDetail = () => {
    if (!slugOrId)
      return Alert.alert("Error", "Room not found for details.");
    router.push(`/room/${slugOrId}`);
  };

  return (
    <View
      style={{
        width: "48%",
        borderRadius: 16,
        marginBottom: 14,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
      }}
    >
      {/* Room detail view */}
      <TouchableOpacity activeOpacity={0.9} onPress={handleViewDetail}>
        <ImageBackground
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={{ height: 220, justifyContent: "flex-end" }}
        >
          <View style={{ backgroundColor: "rgba(0,0,0,0.45)", padding: 8 }}>
            {/* Title & Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: 14,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.name || item.title || "No Room Name"}
              </Text>

              {isOwner && showActions && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {/* Edit Button */}
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      padding: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Edit3 size={16} color="#fff" />
                  </TouchableOpacity>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={{
                      backgroundColor: "rgba(255,0,0,0.35)",
                      padding: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Trash2 size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Address */}
            <Text
              style={{
                color: "#ddd",
                fontSize: 12,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {item.address || item.distance || "No address available"}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}
