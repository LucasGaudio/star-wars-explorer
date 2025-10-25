"use client";
import React from "react";
import styles from "./style.module.scss";

interface SwapiPlanet {
  name: string;
  terrain: string;
  diameter: string;
  climate: string;
  films: string[];
}

interface CardData {
  id?: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  metadata?: Record<string, any>;
}

interface CardProps {
  data: CardData | SwapiPlanet;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

const Card: React.FC<CardProps> = ({ data, className = "", variant = "default" }) => {
  let parsedData: CardData;

    const capitalizeFirstLetter = (str: string) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

  // If it's a SWAPI planet, convert it to CardData
  if ("terrain" in data && "climate" in data && "diameter" in data) {
    parsedData = {
      title: data.name,
      metadata: {
        Diameter: capitalizeFirstLetter(data.diameter),
        Terrain: capitalizeFirstLetter(data.terrain),
        Climate: capitalizeFirstLetter(data.climate),
        Movies: data.films.length > 0 ? data.films : "None",
      },
    };
  } else {
    parsedData = data as CardData;
  }

  const { title, metadata } = parsedData;

  const cardClasses = [styles.card, styles[variant], className].filter(Boolean).join(" ");



  return (
    <div
      className={cardClasses}
    >
      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}

        {metadata && Object.keys(metadata).length > 0 && (
          <div className={styles.metadata}>
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className={styles.metadataItem}>
                <span className={styles.metadataKey}>{key}:</span>
                  {Array.isArray(value) ? value.join(", ") : String(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
