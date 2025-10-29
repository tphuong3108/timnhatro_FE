import { roomApi } from "@/services/roomApi";
import React, { createContext, ReactNode, useContext, useState } from "react";

type Filters = {
  area: string;     
  ward: string;        
  roomType: string;   
  amenities: string[];
  minPrice: number;    
  maxPrice: number;  
  rating: number;     
  totalRatings: number; 
};

type FilterContextType = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredRooms: any[];
  applyFilters: () => Promise<void>;
  resetFilters: () => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({
    area: "",
    ward: "",
    roomType: "",
    amenities: [],
    minPrice: 0,
    maxPrice: 10000000,
    rating: 0,
    totalRatings: 0,
  });

  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);

  const applyFilters = async () => {
    try {
      const params: any = {};

      if (filters.roomType.trim()) params.name = filters.roomType.trim();
      if (filters.area.trim()) params.address = filters.area.trim();
      if (filters.ward.trim()) params.ward = filters.ward.trim();

      //  giá
      if (filters.minPrice > 0) params.priceMin = Number(filters.minPrice);
      if (filters.maxPrice && filters.maxPrice < 10000000)
        params.priceMax = Number(filters.maxPrice);

      //  tiện ích
      if (filters.amenities.length > 0)
        params.amenity = filters.amenities.join(",");

      //  Lọc theo sao
      if (filters.rating > 0)
        params.avgRating = Number(filters.rating);

      //  Lọc theo tổng số đánh giá (nếu có)
      if (filters.totalRatings > 0)
        params.totalRatings = Number(filters.totalRatings);

      console.log(" Sending search params:", params);

      const res = await roomApi.searchRooms(params);
      setFilteredRooms(res || []);
    } catch (error: any) {
      console.error(" Lỗi khi lọc phòng:", error.response?.data || error.message);
      setFilteredRooms([]);
    }
  };

  const resetFilters = () => {
    setFilters({
      area: "",
      ward: "",
      roomType: "",
      amenities: [],
      minPrice: 0,
      maxPrice: 10000000,
      rating: 0,
      totalRatings: 0,
    });
    setFilteredRooms([]);
  };

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, filteredRooms, applyFilters, resetFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
