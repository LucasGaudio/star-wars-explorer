import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const usePlanetsStore = create<PlanetsState>()(
  persist(
    (set) => ({
      planets: [],
      selectedPlanet: null,
      currentPage: 1,
      totalPages: 0,
      isLoading: false,
      searchQuery: "",
      isSearchMode: false,
      allSearchResults: [],

      setPlanets: (planets) => set({ planets }),
      setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setTotalPages: (total) => set({ totalPages: total }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsSearchMode: (mode) => set({ isSearchMode: mode }),
      setAllSearchResults: (results) => set({ allSearchResults: results }),
    }),
    {
      name: "swapi-store",
      partialize: (state) => ({
        selectedPlanet: state.selectedPlanet,
        planets: state.planets,
      }),
    }
  )
);
