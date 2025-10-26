"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlanetsStore } from "@/app/store/usePlanetStore";
import styles from "./page.module.scss";

type TabType = "info" | "films" | "residents";

interface Vehicle {
  name: string;
  model: string
}

interface Specie {
  name: string;
}

export default function PlanetDetailsPage() {
  const { selectedPlanet } = usePlanetsStore();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

    const capitalizeFirstLetter = (str: string) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (!selectedPlanet || !selectedPlanet.name) {
    return (
      <main className={styles.planetDetailPage}>
        <div className={styles.loadingState}>
          Carregando informações do planeta...
        </div>
      </main>
    );
  }

  const formatPopulation = (population: string) => {
    if (population === "unknown") return "Unknown";
    const num = parseInt(population);
    if (isNaN(num)) return population;
    return num.toLocaleString("pt-BR");
  };

  const formatDiameter = (diameter: string) => {
    if (diameter === "unknown") return "Unknown";
    const num = parseInt(diameter);
    if (isNaN(num)) return diameter;
    return `${num.toLocaleString("pt-BR")} km`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Rotation Period</span>
              <span className={styles.value}>
                {selectedPlanet.rotation_period === "unknown" 
                  ? "Unknown" 
                  : `${selectedPlanet.rotation_period} Hours`
                }
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Orbital Period</span>
              <span className={styles.value}>
                {selectedPlanet.orbital_period === "unknown" 
                  ? "Unknown" 
                  : `${selectedPlanet.orbital_period} Days`
                }
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Diameter</span>
              <span className={styles.value}>{formatDiameter(selectedPlanet.diameter)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Climate</span>
              <span className={styles.value}>
                {selectedPlanet.climate === "unknown" 
                  ? "Unknown" 
                  : capitalizeFirstLetter(selectedPlanet.climate)
                }
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Gravity</span>
              <span className={styles.value}>
                {selectedPlanet.gravity === "unknown" 
                  ? "Unknown" 
                  : selectedPlanet.gravity
                }
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Terrain</span>
              <span className={styles.value}>
                {selectedPlanet.terrain === "unknown" 
                  ? "Unknown" 
                  : capitalizeFirstLetter(selectedPlanet.terrain)
                }
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Population</span>
              <span className={styles.value}>{formatPopulation(selectedPlanet.population)}</span>
            </div>
          </div>
        );

      case "films":
        return (
          <ul className={styles.filmsList}>
            {selectedPlanet.films && selectedPlanet.films.length > 0 ? (
              selectedPlanet.films.map((film: any) => (
                <li key={film.title || film} className={styles.filmItem}>
                  <span className={styles.filmTitle}>{film.title || film}</span>
                </li>
              ))
            ) : (
              <li className={styles.filmItem}>
                <span className={styles.filmTitle}>Nenhum filme encontrado</span>
              </li>
            )}
          </ul>
        );

      case "residents":
        return selectedPlanet.residents && selectedPlanet.residents.length > 0 ? (
          <ul className={styles.residentsList}>
            {selectedPlanet.residents.map((res: any) => (
              <li key={res.name} className={styles.residentItem}>
                <div className={styles.residentName}>{res.name}</div>
                <div className={styles.residentDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Hair Color</span>
                    <span className={styles.detailValue}>
                      {res.hair_color === "unknown" ? "Unknown" : capitalizeFirstLetter(res.hair_color)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Eye Color</span>
                    <span className={styles.detailValue}>
                      {res.eye_color === "unknown" ? "Unknown" : capitalizeFirstLetter(res.eye_color)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Gender</span>
                    <span className={styles.detailValue}>
                      {res.gender === "unknown" ? "Unknown" : capitalizeFirstLetter(res.gender)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Species</span>
                    {res.species && res.species.length > 0 ? (
                      <span className={styles.detailValue}>
                        {res.species.map((s: Specie) => s.name).join(", ")}
                      </span>
                    ) : <span className={styles.detailValue}>N/a</span>}
                  </div>

                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Vehicles</span>
                    {res.vehicles && res.vehicles.length > 0 ? (
                        <span className={styles.detailValue}>
                          {res.vehicles.map((v: Vehicle) => `${v.name} (${v.model})`).join(", ")}
                        </span>
                      ) : <span className={styles.detailValue}>N/a</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.noResidents}>
            No known native.
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className={styles.planetDetailPage}>
      <div className={styles.container}>
        <div className={styles.planetHeader}>
          <button className={styles.backButton} onClick={handleGoBack}>
            <svg 
              className={styles.arrowIcon} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className={styles.planetName}>{selectedPlanet.name}</h1>
        </div>

        <div className={styles.tabContainer}>
          <div className={styles.tabNavigation}>
            <button
              className={`${styles.tabButton} ${activeTab === "info" ? styles.active : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Planet Information
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "films" ? styles.active : ""}`}
              onClick={() => setActiveTab("films")}
            >
              Movies
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "residents" ? styles.active : ""}`}
              onClick={() => setActiveTab("residents")}
            >
              Natives
            </button>
          </div>
          
          <div className={styles.tabContent}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </main>
  );
}
