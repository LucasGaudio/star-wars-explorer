"use client";
import styles from "./page.module.scss";
import Link from "next/link";
import SearchField from "./components/SearchField";
import Card from "./components/Card";
import Pagination from "./components/Pagination";
import { useEffect } from "react";
import { usePlanetsStore } from "@/app/store/usePlanetStore";
import { fetchPlanets, searchPlanets, enrichPlanetsWithDetails } from "@/app/services/swapi"

export default function Home() {
  const { 
    planets, 
    setPlanets, 
    setSelectedPlanet, 
    currentPage, 
    setCurrentPage, 
    totalPages, 
    setTotalPages, 
    isLoading, 
    setIsLoading,
    searchQuery,
    setSearchQuery,
    isSearchMode,
    setIsSearchMode,
    allSearchResults,
    setAllSearchResults
  } = usePlanetsStore();

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setIsSearchMode(false);
            setSearchQuery("");
            setAllSearchResults([]);
            loadPlanets(currentPage);
            return;
        }

        setIsLoading(true);
        setSearchQuery(query);
        setIsSearchMode(true);
        
        try {
            const data = await searchPlanets(query);
            const enriched = await enrichPlanetsWithDetails(data);

            const filteredResults = enriched.results.filter((planet: any) => 
                planet.name.toLowerCase().startsWith(query.toLowerCase())
            );

            setAllSearchResults(filteredResults);
            
            const itemsPerPage = 10;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageResults = filteredResults.slice(startIndex, endIndex);
            
            setPlanets(pageResults);
            setTotalPages(Math.ceil(filteredResults.length / itemsPerPage));
            
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Error searching planets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setIsSearchMode(false);
        setSearchQuery("");
        setAllSearchResults([]);
        loadPlanets(currentPage);
    };

    const loadPlanets = async (page: number) => {
        setIsLoading(true);
        try {
            const data = await fetchPlanets(page);
            const enriched = await enrichPlanetsWithDetails(data);
            setPlanets(enriched.results);
            setTotalPages(Math.ceil(data.count / 10)); // SWAPI 10 items por pagina
        } catch (error) {
            console.error("Error loading planets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (isSearchMode) {
            const itemsPerPage = 10;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageResults = allSearchResults.slice(startIndex, endIndex);
            setPlanets(pageResults);
        } else {
            loadPlanets(page);
        }
    };

    useEffect(() => {
        loadPlanets(currentPage);
    }, []);

   
    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>SW Explorer</h1>
                <p className={styles.subtitle}>
                    Welcome to <span>Star Wars Explorer</span>! Choose or search a planet below that you want to see and learn more about this galaxy far, far away.
                </p>
            </header>

            <SearchField 
                placeholder="Search for planets..." 
                onSearch={handleSearch}
                value={searchQuery}
                onClear={handleClearSearch}
                isSearching={isLoading && isSearchMode}
            />
            
            {isSearchMode && (
                <div className={styles.searchStatus}>
                    <p className={styles.resultCount}>
                        {isLoading ? (
                            <span className={styles.searching}>Searching...</span>
                        ) : (
                            `${allSearchResults.length} planet${allSearchResults.length !== 1 ? 's' : ''} found`
                        )}
                    </p>
                </div>
            )}
            
            {isLoading ? (
                <div className={styles.loading}>
                    <p>Loading planets...</p>
                </div>
            ) : (
                <>
                    <div className={styles.cardsGrid}>
                        {planets.map((cardData) => (
                            <Link key={cardData.name} style={{ textDecoration: 'none', color: 'inherit'}} onClick={() => setSelectedPlanet(cardData)} href={`/planets/${encodeURIComponent(cardData.name.toLowerCase())}`}>
                                <Card data={cardData} />
                            </Link>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                    />
                </>
            )}

            <footer className={styles.footer}/>
        </main>
    );
}