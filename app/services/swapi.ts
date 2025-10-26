export const SWAPI_BASE_URL = "https://swapi.dev/api";

export async function fetchPlanets(page: number = 1) {
  const res = await fetch(`${SWAPI_BASE_URL}/planets/?page=${page}`);
  if (!res.ok) throw new Error("Falha ao buscar planetas");
  return res.json();
}

export async function fetchPlanet(id: string) {
  const res = await fetch(`${SWAPI_BASE_URL}/planets/${id}`);
  if (!res.ok) throw new Error("Falha ao buscar planeta");
  return res.json();
}

export async function searchPlanets(query: string) {
  const res = await fetch(`${SWAPI_BASE_URL}/planets/?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Falha ao buscar planetas");
  return res.json();
}

export async function fetchMultiple(urls: string[]) {
  const promises = urls.map((url) => fetch(url).then((r) => r.json()));
  return Promise.all(promises);
}

export async function enrichPlanetsWithDetails(data: any) {
  const planets = data.results;

  const filmUrls = new Set<string>();
  const residentUrls = new Set<string>();

  for (const p of planets) {
    (p.films || []).forEach((url: string) => filmUrls.add(url));
    (p.residents || []).forEach((url: string) => residentUrls.add(url));
  }

  const [films, residents] = await Promise.all([
    filmUrls.size ? fetchMultiple([...filmUrls]) : [],
    residentUrls.size ? fetchMultiple([...residentUrls]) : [],
  ]);

  const speciesUrls = new Set<string>();
  const vehicleUrls = new Set<string>();

  for (const r of residents) {
    (r.species || []).forEach((url: string) => speciesUrls.add(url));
    (r.vehicles || []).forEach((url: string) => vehicleUrls.add(url));
  }

  const [species, vehicles] = await Promise.all([
    speciesUrls.size ? fetchMultiple([...speciesUrls]) : [],
    vehicleUrls.size ? fetchMultiple([...vehicleUrls]) : [],
  ]);

  const urlToFilmTitle = new Map(films.map((f: any) => [f.url, f.title]));
  const urlToSpecies = new Map(species.map((s: any) => [s.url, { name: s.name }]));
  const urlToVehicle = new Map(
    vehicles.map((v: any) => [v.url, { name: v.name, model: v.model }])
  );

  const enrichedResidents = residents.map((r: any) => {
    const resolvedSpecies =
      r?.species && r?.species.length > 0
        ? r.species.map((url: string) => urlToSpecies.get(url) || { name: "Unknown" })
        : [{ name: "Human" }];

    const resolvedVehicles =
      r.vehicles && r.vehicles.length > 0
        ? r.vehicles.map(
            (url: string) => urlToVehicle.get(url) || { name: "Unknown", model: "Unknown" }
          )
        : [];

    return {
      name: r.name,
      hair_color: r.hair_color,
      eye_color: r.eye_color,
      gender: r.gender,
      species: resolvedSpecies,
      vehicles: resolvedVehicles,
    };
  });

  const urlToResident = new Map(residents.map((r: any, i: number) => [r.url, enrichedResidents[i]]));

  const enrichedResults = planets.map((p: any) => ({
    ...p,
    films: (p.films || []).map((url: string) => urlToFilmTitle.get(url) || url),
    residents: (p.residents || []).map((url: string) => urlToResident.get(url) || url),
  }));

  return { ...data, results: enrichedResults };
}

