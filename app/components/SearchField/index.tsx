"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./style.module.scss";

interface SearchFieldProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  onClear?: () => void;
  isSearching?: boolean;
}

const SearchField: React.FC<SearchFieldProps> = ({ placeholder = "Buscar...", onSearch, value = "", onClear, isSearching = false }) => {
  const [query, setQuery] = useState(value);

  // Update local state when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (onSearch) onSearch(searchQuery.trim());
        }, 300); // 300ms delay
      };
    })(),
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Trigger search as user types
    debouncedSearch(newQuery);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    if (onClear) onClear();
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
      />
      {query && (
        <button type="button" className={styles.clearButton} onClick={handleClear}>
          ✕
        </button>
      )}
    </form>
  );
};

export default SearchField;
