import { create } from "zustand";

interface Planet {
  name: string;
  terrain: string;
  diameter: string;
  climate: string;
  films: string[];
  url: string;
  residents: string[];
  gravity: string;
  population: string;
  orbital_period: string;
  rotation_period: string;
}

interface PlanetsState {
  planets: Planet[];
  setPlanets: (planets: Planet[]) => void;
  selectedPlanet: Planet | null;
  setSelectedPlanet: (planet: Planet | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchMode: boolean;
  setIsSearchMode: (isSearch: boolean) => void;
  allSearchResults: Planet[];
  setAllSearchResults: (results: Planet[]) => void;
}

export const usePlanetsStore = create<PlanetsState>((set) => ({
  planets: [],
  setPlanets: (planets) => set({ planets }),
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  totalPages: 1,
  setTotalPages: (pages) => set({ totalPages: pages }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchMode: false,
  setIsSearchMode: (isSearch) => set({ isSearchMode: isSearch }),
  allSearchResults: [],
  setAllSearchResults: (results) => set({ allSearchResults: results }),
}));
