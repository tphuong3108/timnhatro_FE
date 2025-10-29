// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { useFilter } from "./FilterContext";

// const roomTypes = [
//   "Phòng trọ", "Chung cư mini", "Mặt tiền", "Căn hộ", "Homestay", "Sleepbox"
// ];

// export default function RoomTypeSelector() {
//   const { filters, setFilters } = useFilter();

//   const toggleType = (type: string) => {
//     setFilters({ ...filters, roomType: type });
//   };

//   return (
//     <View className="mb-5">
//       <Text className="font-semibold text-base mb-2">Loại phòng</Text>
//       <View className="flex-row flex-wrap">
//         {roomTypes.map((type) => {
//           const selected = filters.roomType === type;
//           return (
//             <TouchableOpacity
//               key={type}
//               onPress={() => toggleType(type)}
//               className={`px-4 py-2 m-1 rounded-full border ${
//                 selected
//                   ? "bg-[#3F72AF] border-[#3F72AF]"
//                   : "bg-white border-gray-300"
//               }`}
//             >
//               <Text
//                 className={`text-[13px] ${
//                   selected ? "text-white" : "text-[#112D4E]"
//                 }`}
//               >
//                 {type}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// }
