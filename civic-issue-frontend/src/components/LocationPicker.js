import React, { useEffect, useRef } from "react";

const LocationPicker = ({ lat, lng, onChange, className = "" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

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

          // Add draggable marker
          const marker = L.marker([mapLat, mapLng], { draggable: true }).addTo(
            map
          );
          marker.bindPopup(
            `Drag me to set location<br/>Coordinates: ${mapLat.toFixed(
              6
            )}, ${mapLng.toFixed(6)}`
          );

          // Handle marker drag events
          marker.on("dragend", function (event) {
            const position = event.target.getLatLng();
            const newLat = position.lat;
            const newLng = position.lng;

            // Update popup content
            marker.setPopupContent(
              `Drag me to set location<br/>Coordinates: ${newLat.toFixed(
                6
              )}, ${newLng.toFixed(6)}`
            );

            // Call the callback function to update parent component
            if (onChange) {
              onChange(newLat, newLng);
            }
          });

          // Handle map click to move marker
          map.on("click", function (event) {
            const { lat: newLat, lng: newLng } = event.latlng;
            marker.setLatLng([newLat, newLng]);

            // Update popup content
            marker.setPopupContent(
              `Drag me to set location<br/>Coordinates: ${newLat.toFixed(
                6
              )}, ${newLng.toFixed(6)}`
            );

            // Call the callback function to update parent component
            if (onChange) {
              onChange(newLat, newLng);
            }
          });

          mapInstanceRef.current = map;
          markerRef.current = marker;
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
        markerRef.current = null;
      }
    };
  }, []); // Empty dependency array to initialize only once

  // Update marker position when lat/lng props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const newPosition = [mapLat, mapLng];
      markerRef.current.setLatLng(newPosition);
      mapInstanceRef.current.setView(
        newPosition,
        mapInstanceRef.current.getZoom()
      );

      // Update popup content
      markerRef.current.setPopupContent(
        `Drag me to set location<br/>Coordinates: ${mapLat.toFixed(
          6
        )}, ${mapLng.toFixed(6)}`
      );
    }
  }, [mapLat, mapLng]);

  return (
    <div
      className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}
      style={{ height: "300px" }}
    >
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      <div className="text-xs text-gray-500 mt-2 text-center">
        💡 Click on the map or drag the marker to set location
      </div>
    </div>
  );
};

export default LocationPicker;
