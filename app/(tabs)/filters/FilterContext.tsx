import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FilterState {
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  beds: number;
  baths: number;
  amenities: string[];
  instantBook: boolean;
  selfCheckIn: boolean;
  petsAllowed: boolean;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

const defaultFilter: FilterState = {
  priceMin: 500000,
  priceMax: 7000000,
  bedrooms: 0,
  beds: 0,
  baths: 0,
  amenities: [],
  instantBook: false,
  selfCheckIn: false,
  petsAllowed: false,
};

const FilterContext = createContext<FilterContextType>({
  filters: defaultFilter,
  setFilters: () => {},
  resetFilters: () => {},
});

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilter);

  const resetFilters = () => setFilters(defaultFilter);

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
