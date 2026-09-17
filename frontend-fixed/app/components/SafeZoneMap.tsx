"use client";
/* eslint-disable */

import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix leafet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function FlyToLocation({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 14, { duration: 1.5 });
  }, [lat, lon, map]);
  return null;
}

export default function SafeZoneMap({ userLocation, safePoints }: { userLocation: {lat: number, lon: number}, safePoints: any[] }) {
  if (!userLocation) return null;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative border border-[#DCE4DF] shadow-sm" style={{ minHeight: "100%" }}>
      <MapContainer 
        center={[userLocation.lat, userLocation.lon]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', minHeight: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <FlyToLocation lat={userLocation.lat} lon={userLocation.lon} />

        {/* User Location */}
        <CircleMarker 
          center={[userLocation.lat, userLocation.lon]}
          radius={8}
          pathOptions={{ color: '#0284C7', fillColor: '#38BDF8', fillOpacity: 0.9, weight: 3 }}
        >
          <Popup className="font-sans">
            <strong className="text-xs">Your Current GPS Position</strong>
          </Popup>
        </CircleMarker>

        {/* Safe Points */}
        {safePoints.map((sp, idx) => (
          <Marker key={idx} position={[sp.latitude || userLocation.lat + (Math.random() - 0.5) * 0.02, sp.longitude || userLocation.lon + (Math.random() - 0.5) * 0.02]}>
            <Popup>
              <div className="font-bold text-sm text-[#012016]">{sp.name}</div>
              <div className="text-[11px] uppercase font-bold text-[#2C694C]">{sp.type || "Designated Safe Shelter"}</div>
              {sp.capacity && <div className="text-[10px] text-slate-600 mt-1">Capacity: {sp.capacity} persons</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div
        className="
          absolute
          bottom-4
          left-4
          z-[1000]
          rounded-xl
          bg-white/95 backdrop-blur-md border border-[#DCE4DF]
          p-3
          text-[#012016]
          shadow-lg
          flex flex-col gap-2
          text-xs font-semibold tracking-wide
        "
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#0284C7] ring-2 ring-[#38BDF8]/40 animate-pulse"></div>
          <span>Your GPS Position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-[#2C694C] border border-[#17352A]"></div>
          <span>Safe Relief Shelter</span>
        </div>
      </div>
    </div>
  );
}



