import React, { useEffect, useRef } from "react";

const IssueMap = ({ lat, lng, className = "" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Default to a central location if coordinates are not provided
  const defaultLat = 40.7128;
  const defaultLng = -74.006;

  const mapLat = lat || defaultLat;
  const mapLng = lng || defaultLng;

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (
        typeof window !== "undefined" &&
        mapRef.current &&
        !mapInstanceRef.current
      ) {
        try {
          const L = await import("leaflet");

          // Fix for default markers
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
            iconUrl: "/leaflet/images/marker-icon.png",
            shadowUrl: "/leaflet/images/marker-shadow.png",
          });

          // Create map
          const map = L.map(mapRef.current).setView([mapLat, mapLng], 15);

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          // Add marker
          const marker = L.marker([mapLat, mapLng]).addTo(map);
          marker.bindPopup(
            `Issue Location<br/>Coordinates: ${mapLat.toFixed(
              6
            )}, ${mapLng.toFixed(6)}`
          );

          mapInstanceRef.current = map;
        } catch (error) {
          console.error("Error loading map:", error);
        }
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLat, mapLng]);

  return (
    <div
      className={`h-64 rounded-lg overflow-hidden border border-gray-200 ${className}`}
    >
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default IssueMap;
