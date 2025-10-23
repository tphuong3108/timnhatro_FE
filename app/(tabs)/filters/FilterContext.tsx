import React, { createContext, useContext, useState, ReactNode } from "react";
import rooms, { Room } from "@/constants/data/rooms";

type Filters = {
  area: string;
  roomType: string;
  amenities: string[];
  minPrice: number;
  maxPrice: number;
};

type FilterContextType = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredRooms: Room[];
  applyFilters: () => void;
  resetFilters: () => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({
    area: "",
    roomType: "",
    amenities: [],
    minPrice: 0,
    maxPrice: 10000000,
  });

  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);

  const applyFilters = () => {
    let results = rooms.filter((r) => {
      const inArea =
        !filters.area || r.address?.toLowerCase().includes(filters.area.toLowerCase());
      const inType =
        !filters.roomType || r.name?.toLowerCase().includes(filters.roomType.toLowerCase());
      const inAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((a) =>
          r.amenities?.some((b) => b.toLowerCase().includes(a.toLowerCase()))
        );
      const inPrice = r.price >= filters.minPrice && r.price <= filters.maxPrice;

      return inArea && inType && inAmenities && inPrice;
    });

    setFilteredRooms(results);
  };

  const resetFilters = () => {
    setFilters({
      area: "",
      roomType: "",
      amenities: [],
      minPrice: 0,
      maxPrice: 10000000,
    });
    setFilteredRooms(rooms);
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
