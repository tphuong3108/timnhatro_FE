import React from "react";
import { Text, View } from "react-native";
import RoomCard, { RoomData } from "./RoomCard";

interface AIMessageParserProps {
  text: string;
  rooms?: RoomData[];
}

// Check if response contains room data
function containsRoomData(text: string): boolean {
  return text.includes("🏠") && text.includes("📍") && text.includes("💰");
}

// Extract greeting and closing from text
function extractTextParts(text: string): { greeting: string; closing: string } {
  let greeting = "";
  let closing = "";

  // Extract greeting - text before first room
  const firstRoomIndex = text.indexOf("🏠");
  if (firstRoomIndex > 0) {
    greeting = text.substring(0, firstRoomIndex).trim();
  } else if (!text.includes("🏠")) {
    // No room in text, return entire text as greeting
    return { greeting: text, closing: "" };
  }

  // Extract closing - text after last room info (look for common closing patterns)
  const closingPatterns = [
    /(?:Hy vọng|Hãy xem|Nếu bạn|Chúc bạn|Bạn có thể).+$/s,
  ];

  for (const pattern of closingPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Check if it's after all room data
      const lastRoomEnd = text.lastIndexOf("🔗");
      if (lastRoomEnd !== -1 && match.index && match.index > lastRoomEnd) {
        closing = match[0].trim();
        break;
      }
    }
  }

  // Fallback: look for emoji-based closing
  if (!closing) {
    const emojiClosingMatch = text.match(/(?:\n\n|\r\n\r\n)([^🏠📍💰📝✨🔗].{10,}(?:😊|📊|🎉|👍|💪|🏠|!\s*$))/);
    if (emojiClosingMatch) {
      closing = emojiClosingMatch[1].trim();
    }
  }

  return { greeting, closing };
}

export default function AIMessageParser({ text, rooms = [] }: AIMessageParserProps) {
  // If no rooms provided and text doesn't contain room data, return null
  if (rooms.length === 0 && !containsRoomData(text)) {
    return null;
  }

  const { greeting, closing } = extractTextParts(text);

  return (
    <View className="w-full">
      {/* Greeting text */}
      {greeting && (
        <Text className="text-gray-700 text-sm mb-3">{greeting}</Text>
      )}

      {/* Room cards from rooms array */}
      {rooms.length > 0 ? (
        <View>
          {rooms.map((room, index) => (
            <RoomCard key={room._id || index} room={room} />
          ))}
        </View>
      ) : (
        // Fallback: show text if no rooms array but text has room data
        <Text className="text-gray-700 text-sm whitespace-pre-wrap">{text}</Text>
      )}

      {/* Closing text */}
      {closing && rooms.length > 0 && (
        <Text className="text-gray-700 text-sm mt-2">{closing}</Text>
      )}
    </View>
  );
}

export { containsRoomData };
