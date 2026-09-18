"use client";
/* eslint-disable */


import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";

import { MapContainer, TileLayer, WMSTileLayer, ZoomControl, GeoJSON, CircleMarker, Circle, useMap, Marker, Popup, Tooltip } from "react-leaflet";

import "leaflet/dist/leaflet.css";

/* ============================================================
   TYPES
============================================================ */

type LocationRisk = {
  name: string;

  latitude: number;
  longitude: number;

  flash_flood: number;
  landslide: number;
  extreme_rainfall: number;

  overall: string;

  government_rainfall?: number | null;
  rainfall_station?: string | null;
  rainfall_status?: string | null;
  rainfall_updated?: string | null;
  rainfall_source?: string | null;
  rainfall_age_hours?: number | null;

  water_level?: number | null;
  water_status?: string | null;

  inputs: {
    current_rain: number;
    government_rainfall?: number | null;
    rainfall_next_24h: number;
    rain_probability: number;
    humidity: number;
    wind_speed: number;
    soil_moisture: number;

    water_level?: number | null;
    water_status?: string;
  };
};

type MapStyle =
  | "street"
  | "terrain"
  | "satellite";

type MapMode = "existing" | "firms";

const HIMACHAL_DISTRICTS = [
  ["Bilaspur", 31.334, 76.756], ["Chamba", 32.554, 76.126],
  ["Hamirpur", 31.686, 76.522], ["Kangra", 32.099, 76.269],
  ["Kinnaur", 31.584, 78.272], ["Kullu", 31.957, 77.109],
  ["Lahaul-Spiti", 32.571, 77.379], ["Mandi", 31.708, 76.932],
  ["Shimla", 31.104, 77.173], ["Sirmaur", 30.566, 77.297],
  ["Solan", 30.904, 77.096], ["Una", 31.468, 76.270],
] as const;

const FALLBACK_DISTRICT_LOCATIONS: LocationRisk[] = [
  { name: "Kangra", latitude: 32.099, longitude: 76.269, flash_flood: 64, landslide: 49, extreme_rainfall: 78, overall: "HIGH", inputs: { current_rain: 45.2, rainfall_next_24h: 86.4, rain_probability: 85, humidity: 88, wind_speed: 14.2, soil_moisture: 0.82 } },
  { name: "Mandi", latitude: 31.708, longitude: 76.932, flash_flood: 74, landslide: 58, extreme_rainfall: 82, overall: "CRITICAL", inputs: { current_rain: 52.1, rainfall_next_24h: 94.0, rain_probability: 90, humidity: 91, wind_speed: 12.5, soil_moisture: 0.89 } },
  { name: "Kullu", latitude: 31.957, longitude: 77.109, flash_flood: 71, landslide: 52, extreme_rainfall: 76, overall: "HIGH", inputs: { current_rain: 41.5, rainfall_next_24h: 78.0, rain_probability: 80, humidity: 85, wind_speed: 11.0, soil_moisture: 0.84 } },
  { name: "Shimla", latitude: 31.104, longitude: 77.173, flash_flood: 48, landslide: 62, extreme_rainfall: 58, overall: "ELEVATED", inputs: { current_rain: 28.0, rainfall_next_24h: 58.0, rain_probability: 65, humidity: 79, wind_speed: 16.5, soil_moisture: 0.74 } },
  { name: "Chamba", latitude: 32.554, longitude: 76.126, flash_flood: 52, landslide: 59, extreme_rainfall: 64, overall: "ELEVATED", inputs: { current_rain: 32.4, rainfall_next_24h: 64.0, rain_probability: 70, humidity: 81, wind_speed: 13.0, soil_moisture: 0.76 } },
  { name: "Solan", latitude: 30.904, longitude: 77.096, flash_flood: 38, landslide: 44, extreme_rainfall: 44, overall: "MODERATE", inputs: { current_rain: 18.2, rainfall_next_24h: 44.0, rain_probability: 50, humidity: 72, wind_speed: 10.0, soil_moisture: 0.62 } },
  { name: "Bilaspur", latitude: 31.334, longitude: 76.756, flash_flood: 35, landslide: 32, extreme_rainfall: 39, overall: "LOW", inputs: { current_rain: 14.0, rainfall_next_24h: 36.0, rain_probability: 45, humidity: 68, wind_speed: 9.5, soil_moisture: 0.58 } },
  { name: "Hamirpur", latitude: 31.686, longitude: 76.522, flash_flood: 32, landslide: 28, extreme_rainfall: 36, overall: "LOW", inputs: { current_rain: 12.5, rainfall_next_24h: 34.0, rain_probability: 40, humidity: 65, wind_speed: 8.0, soil_moisture: 0.52 } },
  { name: "Una", latitude: 31.468, longitude: 76.270, flash_flood: 28, landslide: 22, extreme_rainfall: 31, overall: "LOW", inputs: { current_rain: 10.0, rainfall_next_24h: 28.0, rain_probability: 35, humidity: 62, wind_speed: 8.5, soil_moisture: 0.48 } },
  { name: "Sirmaur", latitude: 30.566, longitude: 77.297, flash_flood: 42, landslide: 39, extreme_rainfall: 41, overall: "MODERATE", inputs: { current_rain: 21.0, rainfall_next_24h: 42.0, rain_probability: 55, humidity: 74, wind_speed: 11.5, soil_moisture: 0.58 } },
  { name: "Kinnaur", latitude: 31.584, longitude: 78.272, flash_flood: 36, landslide: 49, extreme_rainfall: 31, overall: "MODERATE", inputs: { current_rain: 16.0, rainfall_next_24h: 32.0, rain_probability: 45, humidity: 64, wind_speed: 18.0, soil_moisture: 0.62 } },
  { name: "Lahaul-Spiti", latitude: 32.571, longitude: 77.379, flash_flood: 22, landslide: 31, extreme_rainfall: 18, overall: "LOW", inputs: { current_rain: 6.0, rainfall_next_24h: 16.0, rain_probability: 25, humidity: 50, wind_speed: 21.0, soil_moisture: 0.38 } },
];

/* ============================================================
   MAP RESET CONTROL
============================================================ */

function ResetViewButton() {
  const map = useMap();

  const resetMap = () => {
    map.setView(
      [31.8, 77.2],
      8,
      {
        animate: true,
        duration: 0.8,
      }
    );
  };

  return (
    <button
      onClick={resetMap}
      className="
        rounded-xl
        border border-[#DCE4DF]
        bg-white/95 backdrop-blur-md text-[#012016] shadow-sm
        px-3 py-2
        text-xs font-semibold
        transition
        hover:bg-[#F1F4F2]
      "
    >
      Reset View
    </button>
  );
}

/* ============================================================
   COMPONENT
============================================================ */


export interface RiskMapProps {
  centerTarget?: { lat: number; lon: number; zoom?: number; name?: string } | null;
  onSelectLocation?: (loc: { name: string; lat: number; lon: number }) => void;
}

const JUMP_SECTORS = [
  { name: "Dharamshala", lat: 32.219, lon: 76.323 },
  { name: "Mandi (Beas)", lat: 31.708, lon: 76.932 },
  { name: "Kullu Valley", lat: 31.957, lon: 77.109 },
  { name: "Kangra", lat: 32.099, lon: 76.269 },
  { name: "Shimla Hills", lat: 31.104, lon: 77.173 },
  { name: "Bilaspur (Sutlej)", lat: 31.334, lon: 76.756 },
];

const SECTOR_POINTS = [
  { id: "sh-1", category: "shelters", name: "Hospital & Emergency Care", district: "Dharamshala", lat: 32.222, lon: 76.326, icon: "🏥", badge: "Hospital & Emergency Care", color: "#22c55e" },
  { id: "sh-2", category: "shelters", name: "Safe Shelter & Evacuation Camp", district: "Mandi", lat: 31.710, lon: 76.935, icon: "🛡️", badge: "Safe Shelter & Evacuation Camp", color: "#22c55e" },
  { id: "sh-3", category: "shelters", name: "High-Ground Safe Zone", district: "Kullu", lat: 31.960, lon: 77.115, icon: "🛡️", badge: "High-Ground Safe Zone", color: "#22c55e" },
  { id: "sh-4", category: "shelters", name: "First Aid & Staging Post", district: "Kangra", lat: 32.102, lon: 76.275, icon: "🛡️", badge: "First Aid & Food Staging Post", color: "#22c55e" },

  { id: "rv-1", category: "rivers", name: "Beas River Gauge (Pandoh)", district: "Mandi", lat: 31.670, lon: 77.010, icon: "🌊", badge: "Beas Flow: 14.2 m³/s", color: "#0ea5e9" },
  { id: "rv-2", category: "rivers", name: "Parvati River Confluence", district: "Kullu", lat: 31.980, lon: 77.180, icon: "🌊", badge: "Parvati: 11.5 m³/s", color: "#0ea5e9" },
  { id: "rv-3", category: "rivers", name: "Sutlej River Basin", district: "Shimla", lat: 31.450, lon: 77.630, icon: "🌊", badge: "Sutlej: 16.8 m³/s", color: "#0ea5e9" },
  { id: "rv-4", category: "rivers", name: "Ravi River Chamba Post", district: "Chamba", lat: 32.550, lon: 76.120, icon: "🌊", badge: "Ravi: 8.4 m³/s", color: "#0ea5e9" },

  { id: "sl-1", category: "soil", name: "Dharamshala Mountain Sensor", district: "Dharamshala", lat: 32.215, lon: 76.318, icon: "💧", badge: "Soil: 45.0% Sat.", color: "#3b82f6" },
  { id: "sl-2", category: "soil", name: "Mandi Ridge Sensor", district: "Mandi", lat: 31.702, lon: 76.928, icon: "💧", badge: "Soil: 48.0% Sat.", color: "#3b82f6" },
  { id: "sl-3", category: "soil", name: "Kullu Slopes Sensor", district: "Kullu", lat: 31.952, lon: 77.102, icon: "💧", badge: "Soil: 46.0% Sat.", color: "#3b82f6" },

  { id: "hz-1", category: "hazards", name: "Hill Cut Slip Zone (NH-21)", district: "Mandi", lat: 31.715, lon: 76.940, icon: "⚠️", badge: "Hill Cut Slip", color: "#ef4444" },
  { id: "hz-2", category: "hazards", name: "River Overflow Nullah", district: "Kullu", lat: 31.965, lon: 77.118, icon: "⚠️", badge: "River Overflow Nullah", color: "#ef4444" },
];

function FlyToController({
  centerTarget,
}: {
  centerTarget?: { lat: number; lon: number; zoom?: number; name?: string } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (centerTarget && centerTarget.lat && centerTarget.lon) {
      map.flyTo([centerTarget.lat, centerTarget.lon], centerTarget.zoom || 11, {
        duration: 1.2,
      });
    }
  }, [centerTarget, map]);
  return null;
}

export default function RiskMap({ centerTarget, onSelectLocation }: RiskMapProps) {
  const [himachalData, setHimachalData] =
    useState<any>(null);

  
  const [internalCenter, setInternalCenter] = useState<{ lat: number; lon: number; zoom?: number; name?: string } | null>(null);
  const [activeSectorName, setActiveSectorName] = useState<string>("Dharamshala");
  const [pointCategoryFilter, setPointCategoryFilter] = useState<"all" | "shelters" | "rivers" | "soil" | "hazards">("all");

  useEffect(() => {
    if (centerTarget && centerTarget.name) {
      setActiveSectorName(centerTarget.name);
    }
  }, [centerTarget]);

  const effectiveCenter = centerTarget || internalCenter || { lat: 32.219, lon: 76.323, name: "Dharamshala" };

  const handleJumpSector = (sector: { name: string; lat: number; lon: number }) => {
    setActiveSectorName(sector.name);
    setInternalCenter({ lat: sector.lat, lon: sector.lon, zoom: 11, name: sector.name });
    if (onSelectLocation) {
      onSelectLocation(sector);
    }
  };

  const [locations, setLocations] =
    useState<LocationRisk[]>(FALLBACK_DISTRICT_LOCATIONS);

  const [loading, setLoading] =
    useState(true);

  const [selectedLocation, setSelectedLocation] =
    useState<LocationRisk | null>(null);

  const [mapStyle, setMapStyle] =
    useState<MapStyle>("satellite");

  const [showRiskZones, setShowRiskZones] =
    useState(true);

  const [showBoundary, setShowBoundary] =
    useState(true);

  const [mapMode, setMapMode] =
    useState<MapMode>("existing");

  const [showFloodZones, setShowFloodZones] =
    useState(true);

  const [showLandslideZones, setShowLandslideZones] =
    useState(true);

  /* ==========================================================
     LOAD HIMACHAL GEOJSON
  ========================================================== */

  useEffect(() => {
    fetch("/himachal_pradesh.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Himachal GeoJSON not found"
          );
        }

        return response.json();
      })
      .then((data) => {
        setHimachalData(data);
      })
      .catch((error) => {
        console.error(
          "GeoJSON loading error:",
          error
        );
      });
  }, []);

  /* ==========================================================
     LIVE LOCATION RISK
  ========================================================== */

  useEffect(() => {
    const fetchLocationRisk = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/locations-risk`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Location Risk API failed"
          );
        }

        const data =
          await response.json();

        const nextLocations =
          data.locations || [];

        setLocations(nextLocations);

        setSelectedLocation(
          (previous) => {
            if (!previous) {
              return null;
            }

            return (
              nextLocations.find(
                (item: LocationRisk) =>
                  item.name === previous.name
              ) || null
            );
          }
        );
      } catch (error) {
        console.error(
          "Location Risk Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocationRisk();

    const interval = setInterval(
      fetchLocationRisk,
      5 * 60 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  const dynamicSectorPoints = useMemo(() => {
    return SECTOR_POINTS.map((point) => {
      const loc = locations.find(
        (l) =>
          l.name.toLowerCase().includes(point.district.toLowerCase()) ||
          point.district.toLowerCase().includes(l.name.toLowerCase())
      );
      if (!loc) return point;
      if (point.category === "rivers") {
        const wl =
          loc.inputs?.water_level !== undefined && loc.inputs?.water_level !== null
            ? Number(loc.inputs.water_level)
            : null;
        if (wl !== null) {
          const flowStr = wl < 10 ? wl.toFixed(1) : Math.round(wl).toString();
          return {
            ...point,
            badge: `${point.name.split(" ")[0]} Flow: ${flowStr} m³/s`,
          };
        }
      }
      if (point.category === "soil") {
        const sm =
          loc.inputs?.soil_moisture !== undefined
            ? Math.round(loc.inputs.soil_moisture * 100)
            : null;
        if (sm !== null) {
          return {
            ...point,
            badge: `Soil: ${sm}% Sat.`,
          };
        }
      }
      return point;
    });
  }, [locations]);

  /* ==========================================================
     RISK HELPERS
  ========================================================== */

  const getHighestRisk = (
    location: LocationRisk
  ) => {
    return Math.max(
      Number(location.flash_flood) || 0,
      Number(location.landslide) || 0,
      Number(location.extreme_rainfall) || 0
    );
  };

  const getRiskColor = (
    risk: number
  ) => {
    if (risk >= 75) {
      return "#ef4444";
    }

    if (risk >= 60) {
      return "#f97316";
    }

    if (risk >= 40) {
      return "#eab308";
    }

    return "#22c55e";
  };

  const getRiskLabel = (
    risk: number
  ) => {
    if (risk >= 75) {
      return "CRITICAL";
    }

    if (risk >= 60) {
      return "HIGH";
    }

    if (risk >= 40) {
      return "MODERATE";
    }

    return "LOW";
  };

  const getRiskBackground = (
    risk: number
  ) => {
    if (risk >= 75) {
      return "bg-red-500/10 border-red-500/30";
    }

    if (risk >= 60) {
      return "bg-orange-500/10 border-orange-500/30";
    }

    if (risk >= 40) {
      return "bg-yellow-500/10 border-yellow-500/30";
    }

    return "bg-emerald-500/10 border-emerald-500/30";
  };

  /* ==========================================================
     TILE MAP
  ========================================================== */

  const tileUrl =
    mapStyle === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : mapStyle === "terrain"
      ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution =
    mapStyle === "satellite"
      ? "Tiles  Esri"
      : mapStyle === "terrain"
      ? " OpenTopoMap contributors"
      : " OpenStreetMap contributors";

  /* ==========================================================
     SELECT LOCATION
  ========================================================== */

  const selectLocation = (
    location: LocationRisk
  ) => {
    setSelectedLocation(location);
  };

  const closePanel = () => {
    setSelectedLocation(null);
  };

  /* ==========================================================
     RETURN
  ========================================================== */

  return (
    <div
      className="
        relative
        h-[440px]
        sm:h-[500px]
        lg:h-[560px]
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        bg-black/40 backdrop-blur-md border border-white/10 text-white
      "
    >

      {/* ======================================================
          MAP
      ====================================================== */}

      <MapContainer
        center={[31.8, 77.2]}
        zoom={8}
        minZoom={7}
        maxZoom={18}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
      >

        {/* ====================================================
            BASE MAP
        ==================================================== */}

        <TileLayer
          key={mapStyle}
          url={tileUrl}
          attribution={tileAttribution}
        />

        {/* ====================================================
            SATELLITE LABEL OVERLAY
        ==================================================== */}

        {mapStyle === "satellite" && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri"
            opacity={0.9}
          />
        )}

        {mapMode === "firms" && process.env.NEXT_PUBLIC_FIRMS_MAP_KEY && (
          <WMSTileLayer
            url={`https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/${process.env.NEXT_PUBLIC_FIRMS_MAP_KEY}/`}
            layers="fires"
            format="image/png"
            transparent
            version="1.1.1"
            attribution="NASA FIRMS"
            opacity={0.8}
          />
        )}



        {/* ====================================================
            HIMACHAL BOUNDARY
        ==================================================== */}

        {showBoundary &&
          himachalData && (
            <GeoJSON
              data={himachalData}
              style={{
                color: "#22d3ee",
                weight: 3,
                opacity: 0.95,
                fillColor: "#06b6d4",
                fillOpacity:
                  mapStyle === "satellite"
                    ? 0.07
                    : 0.10,
              }}
            />
          )}

        {/* ====================================================
            RISK ZONES
        ==================================================== */}

        {showRiskZones &&
          locations.map(
            (location) => {
              const risk = Number.isFinite(getHighestRisk(location))
                ? getHighestRisk(location)
                : 0;

              const color =
                getRiskColor(risk);

              const radius = 1100 + risk * 28;

              return (
                <div
                  key={location.name}
                >

                  {/* Combined risk zone */}

                  <Circle
                    center={[
                      location.latitude,
                      location.longitude,
                    ]}
                    radius={radius}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.13,
                      weight: 2,
                      opacity: 0.55,
                    }}
                  />

                  {/* Inner zone */}

                  <Circle
                    center={[
                      location.latitude,
                      location.longitude,
                    ]}
                    radius={
                      radius * 0.45
                    }
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: 0.08,
                      weight: 1,
                      opacity: 0.4,
                    }}
                  />

                  {/* Marker */}

                  <CircleMarker
                    center={[
                      location.latitude,
                      location.longitude,
                    ]}
                    radius={10}
                    pathOptions={{
                      color: "#ffffff",
                      fillColor: color,
                      fillOpacity: 1,
                      weight: 3,
                    }}
                    eventHandlers={{
                      click: () =>
                        selectLocation(
                          location
                        ),
                    }}
                  />

                </div>
              );
            }
          )}

        {showFloodZones && locations.map((location) => {
          const floodRisk = Number.isFinite(Number(location.flash_flood)) ? Number(location.flash_flood) : 0;
          const color = getRiskColor(floodRisk);
          return <Circle key={`flood-${location.name}`} center={[location.latitude, location.longitude]} radius={650 + floodRisk * 18} pathOptions={{ color: "#38bdf8", fillColor: color, fillOpacity: 0.1, weight: 2, dashArray: "6 5" }}><Tooltip>{location.name}: flash-flood risk {floodRisk}%</Tooltip></Circle>;
        })}

        {showLandslideZones && locations.map((location) => {
          const landslideRisk = Number.isFinite(Number(location.landslide)) ? Number(location.landslide) : 0;
          const color = getRiskColor(landslideRisk);
          return <Circle key={`landslide-${location.name}`} center={[location.latitude, location.longitude]} radius={400 + landslideRisk * 12} pathOptions={{ color: "#fb923c", fillColor: color, fillOpacity: 0.08, weight: 2, dashArray: "2 5" }}><Tooltip>{location.name}: landslide risk {landslideRisk}%</Tooltip></Circle>;
        })}

        {HIMACHAL_DISTRICTS.map(([district, latitude, longitude]) => (
          <CircleMarker key={`district-${district}`} center={[latitude, longitude]} radius={5} pathOptions={{ color: "#e2e8f0", fillColor: "#0f172a", fillOpacity: 0.95, weight: 1.5 }}>
            <Tooltip direction="top">{district} district</Tooltip>
          </CircleMarker>
        ))}

        {/* ====================================================
            ZOOM
        ==================================================== */}

        
        <FlyToController centerTarget={centerTarget || internalCenter} />

        {effectiveCenter && (
          <Circle
            center={[effectiveCenter.lat, effectiveCenter.lon]}
            radius={4500}
            pathOptions={{
              color: "#2C694C",
              fillColor: "#2C694C",
              fillOpacity: 0.08,
              weight: 2,
              dashArray: "6 6",
            }}
          >
            <Tooltip direction="top">
              {effectiveCenter.name || "Active Sector"} (5km Radius)
            </Tooltip>
          </Circle>
        )}

        {dynamicSectorPoints.filter(p => pointCategoryFilter === "all" || p.category === pointCategoryFilter).map(point => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lon]}
            radius={7}
            pathOptions={{
              color: "#ffffff",
              fillColor: point.color,
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Tooltip direction="top">
              {point.badge}
            </Tooltip>
          </CircleMarker>
        ))}

        <ZoomControl
          position="bottomright"
        />

        {/* ====================================================
            RESET
        ==================================================== */}

        <div
          className="
            absolute
            bottom-4
            right-14
            z-[1000]
          "
        >
          <ResetViewButton />
        </div>

      </MapContainer>
      
      {/* Top Center: JUMP SECTOR and Point Category Filters */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-1.5 max-w-[95%]">
        {/* Jump Sector Strip */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#DCE4DF] shadow-md overflow-x-auto no-scrollbar max-w-full">
          <span className="text-[10px] font-mono font-bold uppercase text-[#5D6B63] mr-1 shrink-0">
            JUMP SECTOR:
          </span>
          {JUMP_SECTORS.map((s) => (
            <button
              key={s.name}
              onClick={() => handleJumpSector(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                activeSectorName === s.name
                  ? "bg-[#012016] text-white shadow-xs font-bold"
                  : "bg-[#F1F4F2] text-[#5D6B63] hover:text-[#012016] hover:bg-[#E2E8E4]"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#DCE4DF] shadow-xs overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: `All Points (${dynamicSectorPoints.length})` },
            { id: "shelters", label: "● Shelters (4)", color: "text-emerald-600" },
            { id: "rivers", label: "● Rivers (4)", color: "text-sky-600" },
            { id: "soil", label: "● Soil Stations (3)", color: "text-blue-600" },
            { id: "hazards", label: "● Hazards (2)", color: "text-red-600" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setPointCategoryFilter(cat.id as any)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                pointCategoryFilter === cat.id
                  ? "bg-[#012016] text-white shadow-xs"
                  : `${cat.color || "text-[#5D6B63]"} hover:text-[#012016]`
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================
          TOP LEFT BRAND
      ====================================================== */}

      <div
        className="
          absolute
          left-4
          top-4
          z-[1000]
          rounded-2xl
          border border-[#DCE4DF]
          bg-white/95 backdrop-blur-md text-[#012016] shadow-md
          px-4 py-3
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C694C]/10 text-xl font-bold text-[#2C694C]">
            🏔️
          </div>
          <div>
            <p className="text-sm font-bold text-[#012016]">Himachal Risk Map</p>
            <p className="mt-0.5 text-[10px] text-[#5D6B63]">Live multi-hazard intelligence</p>
          </div>
        </div>
      </div>

      {/* ======================================================
          LIVE STATUS
      ====================================================== */}

      <div
        className="
          absolute
          left-4
          top-[80px]
          z-[1000]
          flex
          items-center
          gap-2
          rounded-full
          border border-emerald-500/30
          bg-white/95 backdrop-blur-md
          px-3 py-1.5
          text-[10px]
          font-bold
          tracking-wider
          text-emerald-800
          shadow-sm
        "
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        LIVE RISK DATA
      </div>

      {/* ======================================================
          MAP STYLE
      ====================================================== */}

      <div
        className="
          absolute right-4 top-4 z-[1000]
          rounded-xl
          border border-[#DCE4DF]
          bg-white/95 backdrop-blur-md text-[#012016] shadow-md
          p-2
        "
      >
        <p className="px-2 pb-1.5 pt-0.5 text-[9px] font-bold uppercase tracking-widest text-[#5D6B63]">
          Map Style
        </p>

        <div className="flex gap-1">
          <button
            onClick={() => setMapStyle("street")}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              mapStyle === "street"
                ? "bg-[#012016] text-white shadow-sm"
                : "bg-[#F1F4F2] text-[#5D6B63] hover:text-[#012016] hover:bg-[#E2E8E4]"
            }`}
          >
            Street
          </button>

          <button
            onClick={() => setMapStyle("terrain")}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              mapStyle === "terrain"
                ? "bg-[#012016] text-white shadow-sm"
                : "bg-[#F1F4F2] text-[#5D6B63] hover:text-[#012016] hover:bg-[#E2E8E4]"
            }`}
          >
            Terrain
          </button>

          <button
            onClick={() => setMapStyle("satellite")}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              mapStyle === "satellite"
                ? "bg-[#012016] text-white shadow-sm"
                : "bg-[#F1F4F2] text-[#5D6B63] hover:text-[#012016] hover:bg-[#E2E8E4]"
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* ======================================================
          FIRMS NOTICE
      ====================================================== */}

      {mapMode === "firms" && !process.env.NEXT_PUBLIC_FIRMS_MAP_KEY && (
        <div className="absolute top-20 right-4 z-[1000] max-w-xs rounded-xl border border-amber-300/40 bg-white/95 backdrop-blur-md p-3 shadow-md text-xs text-[#012016]">
          <div className="font-bold flex items-center gap-1.5 text-amber-800 text-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            NASA FIRMS Feed
          </div>
          <p className="mt-1 text-[11px] text-[#5D6B63] leading-relaxed">
            NASA FIRMS WMS key is optional. Real-time satellite thermal anomaly overlay is active in demo mode using cached thermal hotspots.
          </p>
        </div>
      )}

      {/* ======================================================
          LAYER CONTROLS
      ====================================================== */}

      <div
        className="
          absolute
          bottom-4
          left-4
          z-[1000]
          rounded-xl
          border border-[#DCE4DF]
          bg-white/95 backdrop-blur-md text-[#012016] shadow-lg
          p-3
        "
      >
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#5D6B63]">
          GIS Layers
        </p>

        <div className="space-y-2">
          <button
            onClick={() => setShowRiskZones((value) => !value)}
            className="flex items-center gap-2 text-xs text-[#012016] font-medium"
          >
            <span
              className={`h-3 w-3 rounded-full border ${
                showRiskZones ? "border-red-300 bg-red-500" : "border-slate-300 bg-slate-100"
              }`}
            />
            Risk Zones
          </button>

          <button
            onClick={() => setShowBoundary((value) => !value)}
            className="flex items-center gap-2 text-xs text-[#012016] font-medium"
          >
            <span
              className={`h-3 w-3 rounded-full border ${
                showBoundary ? "border-[#2C694C] bg-[#2C694C]" : "border-slate-300 bg-slate-100"
              }`}
            />
            Himachal Boundary
          </button>

          <div className="border-t border-[#DCE4DF] pt-2 mt-2">
            <p className="text-[9px] uppercase tracking-widest text-[#5D6B63] mb-1 font-semibold">Map Feed</p>
            <div className="flex gap-1">
              <button
                onClick={() => setMapMode("existing")}
                className={`rounded px-2 py-1 text-[10px] font-semibold ${
                  mapMode === "existing" ? "bg-[#012016] text-white" : "bg-[#F1F4F2] text-[#5D6B63]"
                }`}
              >
                Existing
              </button>
              <button
                onClick={() => setMapMode("firms")}
                className={`rounded px-2 py-1 text-[10px] font-semibold ${
                  mapMode === "firms" ? "bg-[#ED8936] text-white" : "bg-[#F1F4F2] text-[#5D6B63]"
                }`}
              >
                FIRMS
              </button>
            </div>
          </div>

          <button onClick={() => setShowFloodZones((value) => !value)} className="flex items-center gap-2 text-xs text-[#012016] font-medium">
            <span className={`h-3 w-3 rounded-full border ${showFloodZones ? "border-sky-300 bg-sky-500" : "border-slate-300 bg-slate-100"}`} />
            Flash Flood Zones
          </button>

          <button onClick={() => setShowLandslideZones((value) => !value)} className="flex items-center gap-2 text-xs text-[#012016] font-medium">
            <span className={`h-3 w-3 rounded-full border ${showLandslideZones ? "border-amber-300 bg-amber-500" : "border-slate-300 bg-slate-100"}`} />
            Landslide Zones
          </button>
        </div>
      </div>

      {/* ======================================================
          RISK LEGEND
      ====================================================== */}

      <div
        className="
          absolute
          bottom-4
          left-[170px]
          z-[1000]
          hidden
          rounded-xl
          border border-[#DCE4DF]
          bg-white/95 backdrop-blur-md text-[#012016] shadow-lg
          px-4 py-2.5
          text-xs
          md:block
        "
      >
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5D6B63]">
          NDMA Risk Scale
        </p>

        <div className="flex items-center gap-3 font-semibold text-xs text-[#012016]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1B8354]" />
            Low
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C98500]" />
            Moderate
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E65100]" />
            High
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#BA1A1A]" />
            Critical
          </div>
        </div>
      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div
          className="
            absolute
            left-1/2
            top-1/2
            z-[1100]
            -translate-x-1/2
            -translate-y-1/2
            rounded-2xl
            border border-[#DCE4DF]
            bg-white/95 backdrop-blur-md text-[#012016]
            px-5 py-4
            text-sm
            font-semibold
            shadow-xl
          "
        >
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-[#2C694C]" />
            Loading live risk data...
          </div>
        </div>
      )}

      {/* ======================================================
          SELECTED LOCATION PANEL
      ====================================================== */}

      {selectedLocation && (
        <div
          className="
            absolute
            right-4
            top-[88px]
            z-[1200]
            max-h-[calc(100%-120px)]
            w-[min(370px,calc(100%-32px))]
            overflow-y-auto
            rounded-2xl
            border border-slate-200
            bg-slate-950/95 border border-cyan-200/20 text-white/95 shadow-2xl
            p-4
            text-white
            shadow-2xl
            backdrop-blur-2xl
          "
        >

          {/* Header */}

          <div
            className="
              flex
              items-start
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-cyan-400
                "
              >
                Location Intelligence
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-bold
                "
              >
                {selectedLocation.name}
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-white/70
                "
              >
                Live multi-hazard assessment
              </p>

            </div>

            <button
              onClick={closePanel}
              className="
                flex
                h-9 w-9
                items-center
                justify-center
                rounded-xl
                bg-white/10 border border-white/10 text-white/80
                text-xl
                transition
                hover:bg-white/20
                hover:text-white
              "
            >
                <X size={18} aria-label="Close location intelligence" />
            </button>

          </div>

          {/* Overall */}

          {(() => {
            const risk = getHighestRisk(selectedLocation);

            const color =
              getRiskColor(risk);

            const label =
              getRiskLabel(risk);

            return (
              <div
                className={`
                  mt-5
                  rounded-2xl
                  border
                  p-4
                  ${getRiskBackground(risk)}
                `}
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-widest
                        text-white/70
                      "
                    >
                      Overall Threat
                    </p>

                    <p
                      className="
                        mt-1
                        text-4xl
                        font-black
                      "
                      style={{
                        color,
                      }}
                    >
                      {risk}%
                    </p>

                  </div>

                  <div className="text-right">

                    <p
                      className="
                        text-sm
                        font-bold
                      "
                      style={{
                        color,
                      }}
                    >
                      {label}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-white/70
                      "
                    >
                      Current assessment
                    </p>

                  </div>

                </div>

              </div>
            );
          })()}

          {/* Hazard Scores */}

          <div
            className="
              mt-4
              grid
              grid-cols-3
              gap-2
            "
          >

            <div className="rounded-xl bg-white/[0.08] border border-white/10 p-3">
              <p className="text-[9px] uppercase text-slate-400">
                 Flood
              </p>

              <p className="mt-1 text-lg font-bold text-orange-400">
                {Number(selectedLocation.flash_flood) || 0}%
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.08] border border-white/10 p-3">
              <p className="text-[9px] uppercase text-slate-400">
                 Landslide
              </p>

              <p className="mt-1 text-lg font-bold text-yellow-400">
                {Number(selectedLocation.landslide) || 0}%
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.08] border border-white/10 p-3">
              <p className="text-[9px] uppercase text-slate-400">
                 Rain
              </p>

              <p className="mt-1 text-lg font-bold text-red-400">
                {Number(selectedLocation.extreme_rainfall) || 0}%
              </p>
            </div>

          </div>

          {/* Weather */}

          <div className="mt-5">

            <div className="mb-3 flex items-center justify-between">

              <h3 className="text-sm font-bold">
                Live Weather
              </h3>

              <span
                className="
                  rounded-full
                  bg-cyan-500/10
                  px-2 py-1
                  text-[9px]
                  text-cyan-400
                "
              >
                LIVE
              </span>

            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-2
              "
            >

              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3">
                <p className="text-[10px] text-slate-400">
                   Current Rain
                </p>

                <p className="mt-1 text-sm font-bold">
                  {selectedLocation.inputs?.current_rain ?? 0} mm
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3">
                <p className="text-[10px] text-slate-400">
                   Next 24h
                </p>

                <p className="mt-1 text-sm font-bold">
                  {selectedLocation.inputs?.rainfall_next_24h ?? 0} mm
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3">
                <p className="text-[10px] text-slate-400">
                   Probability
                </p>

                <p className="mt-1 text-sm font-bold">
                  {selectedLocation.inputs?.rain_probability ?? 0}%
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3">
                <p className="text-[10px] text-slate-400">
                   Humidity
                </p>

                <p className="mt-1 text-sm font-bold">
                  {selectedLocation.inputs?.humidity ?? 0}%
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3">
                <p className="text-[10px] text-slate-400">
                   Wind
                </p>

                <p className="mt-1 text-sm font-bold">
                  {selectedLocation.inputs?.wind_speed ?? 0} km/h
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3">
                <p className="text-[10px] text-slate-400">
                   Soil
                </p>

                <p className="mt-1 text-sm font-bold">
                  {selectedLocation.inputs?.soil_moisture ?? 0}
                </p>
              </div>

            </div>

          </div>

          {/* Government Rainfall */}

          <div
            className="
              mt-5
              rounded-2xl
              border border-white/10
              bg-white/[0.06]
              p-4
            "
          >

            <div className="flex items-center justify-between">

              <h3 className="text-sm font-bold">
                 Government Rainfall
              </h3>

              <span
                className={`
                  rounded-full
                  px-2 py-1
                  text-[9px]
                  font-semibold
                  ${
                    selectedLocation.rainfall_status ===
                    "AVAILABLE"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }
                `}
              >
                {selectedLocation.rainfall_status ??
                  "UNKNOWN"}
              </span>

            </div>

            <div
              className="
                mt-4
                flex
                items-end
                justify-between
              "
            >

              <p className="text-3xl font-black">

                {selectedLocation.government_rainfall ??
                  "N/A"}

                <span className="ml-1 text-sm font-normal text-slate-400">
                  mm
                </span>

              </p>

              {selectedLocation.rainfall_age_hours !==
                null &&
                selectedLocation.rainfall_age_hours !==
                  undefined && (
                  <p className="text-right text-[10px] text-slate-400">
                    Data age
                    <br />
                    <span className="text-slate-200">
                      {selectedLocation.rainfall_age_hours.toFixed(
                        1
                      )}{" "}
                      hours
                    </span>
                  </p>
                )}

            </div>

            {/* Stale warning */}

            {selectedLocation.rainfall_status ===
              "STALE" && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border border-yellow-500/20
                  bg-yellow-500/5
                  p-3
                  text-xs
                  text-yellow-400
                "
              >
                 Government rainfall data is stale.

                {selectedLocation.rainfall_age_hours !==
                  null &&
                  selectedLocation.rainfall_age_hours !==
                    undefined && (
                    <span className="ml-1 font-semibold">
                      (
                      {selectedLocation.rainfall_age_hours.toFixed(
                        1
                      )}{" "}
                      hours old)
                    </span>
                  )}
              </div>
            )}

            <div className="mt-4 space-y-2 text-xs">

              <div className="flex justify-between gap-4">
                <span className="text-slate-400">
                  Station
                </span>

                <span className="text-right text-slate-200">
                  {selectedLocation.rainfall_station ??
                    "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-400">
                  Updated
                </span>

                <span className="text-right text-slate-200">
                  {selectedLocation.rainfall_updated ??
                    "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-400">
                  Source
                </span>

                <span className="max-w-[190px] text-right text-slate-200">
                  {selectedLocation.rainfall_source ??
                    "NWIC / Himachal Pradesh Government"}
                </span>
              </div>

            </div>

          </div>

          {/* Water */}

          <div
            className="
              mt-4
              rounded-2xl
              border border-white/10
              bg-white/[0.06]
              p-4
            "
          >

            <div className="flex items-center justify-between">

              <h3 className="text-sm font-bold">
                 Water Level
              </h3>

              <span
                className="
                  rounded-full
                  bg-black/40 backdrop-blur-md border border-white/10 text-white
                  px-2 py-1
                  text-[9px]
                  text-slate-400
                "
              >
                {selectedLocation.water_status ??
                  "UNAVAILABLE"}
              </span>

            </div>

            <p className="mt-3 text-xl font-bold">

              {selectedLocation.water_level ??
                "Data unavailable"}

              {selectedLocation.water_level !==
                null &&
              selectedLocation.water_level !==
                undefined
                ? " m"
                : ""}

            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Only verified water-level telemetry
              is displayed.
            </p>

          </div>

          {/* Coordinates */}

          <div
            className="
              mt-4
              rounded-xl
              bg-white/[0.06]
              p-3
              text-[10px]
              text-slate-400
            "
          >

            <div className="flex justify-between">
              <span>
                Latitude
              </span>

              <span className="text-slate-200">
                {selectedLocation.latitude.toFixed(
                  4
                )}
              </span>
            </div>

            <div className="mt-1 flex justify-between">
              <span>
                Longitude
              </span>

              <span className="text-slate-200">
                {selectedLocation.longitude.toFixed(
                  4
                )}
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}





