import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getLocal, setLocal } from "@/lib/local";
import { SearchFilters } from "@/types/job";

interface JobsContextType {
  favoriteJobs: string[];
  toggleFavorite: (jobId: string) => void;
  isFavorite: (jobId: string) => boolean;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteJobs, setFavoriteJobs] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<SearchFilters>(() =>
    getLocal<SearchFilters>("job_search_filters", {}),
  );

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    setFavoriteJobs(getLocal<string[]>("favorite_jobs", []));
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    setLocal("job_search_filters", filters);
  }, [filters]);

  const toggleFavorite = (jobId: string) => {
    const newFavorites = favoriteJobs.includes(jobId)
      ? favoriteJobs.filter((id) => id !== jobId)
      : [...favoriteJobs, jobId];

    setFavoriteJobs(newFavorites);
    setLocal("favorite_jobs", newFavorites);
  };

  const isFavorite = (jobId: string) => favoriteJobs.includes(jobId);

  const setFilters = (newFilters: SearchFilters) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  return (
    <JobsContext.Provider
      value={{
        favoriteJobs,
        toggleFavorite,
        isFavorite,
        filters,
        setFilters,
        clearFilters,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
