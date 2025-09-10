import React, { useEffect, useRef } from "react";

const LocationPicker = ({
  lat,
  lng,
  onChange,
  mode = "manual", // "manual" or "auto"
  className = "",
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const mapLat = lat;
  const mapLng = lng;

  // If no coordinates provided, show message
  const hasValidCoordinates = lat && lng;

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (
        typeof window !== "undefined" &&
        mapRef.current &&
        !mapInstanceRef.current &&
        hasValidCoordinates
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

          // Add marker - draggable only in manual mode
          const isDraggable = mode === "manual";
          const marker = L.marker([mapLat, mapLng], {
            draggable: isDraggable,
          }).addTo(map);

          // Set popup content based on mode
          const popupContent =
            mode === "manual"
              ? `Drag me to set location<br/>Coordinates: ${mapLat.toFixed(
                  6
                )}, ${mapLng.toFixed(6)}`
              : `Your detected location<br/>Coordinates: ${mapLat.toFixed(
                  6
                )}, ${mapLng.toFixed(6)}`;

          marker.bindPopup(popupContent);

          // Handle marker drag events (only for manual mode)
          if (mode === "manual") {
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

            // Handle map click to move marker (only for manual mode)
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
          }

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
  }, [hasValidCoordinates, mapLat, mapLng, mode, onChange]);

  // Update marker position when lat/lng props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current && hasValidCoordinates) {
      const newPosition = [mapLat, mapLng];
      markerRef.current.setLatLng(newPosition);
      mapInstanceRef.current.setView(
        newPosition,
        mapInstanceRef.current.getZoom()
      );

      // Update popup content based on mode
      const popupContent =
        mode === "manual"
          ? `Drag me to set location<br/>Coordinates: ${mapLat.toFixed(
              6
            )}, ${mapLng.toFixed(6)}`
          : `Your detected location<br/>Coordinates: ${mapLat.toFixed(
              6
            )}, ${mapLng.toFixed(6)}`;

      markerRef.current.setPopupContent(popupContent);

      // Update marker draggable state if mode changes
      if (mode === "manual") {
        markerRef.current.dragging.enable();
      } else {
        markerRef.current.dragging.disable();
      }
    }
  }, [mapLat, mapLng, mode, hasValidCoordinates]);

  // Helper text based on mode
  const getHelperText = () => {
    if (!hasValidCoordinates) {
      return "";
    }
    return mode === "manual"
      ? "Drag the marker to adjust location"
      : "This is your detected location";
  };

  return (
    <div
      className={`h-48 rounded-lg shadow border border-gray-200 ${className}`}
    >
      {!hasValidCoordinates ? (
        <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">Location not available</p>
        </div>
      ) : (
        <>
          <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
          {getHelperText() && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              {getHelperText()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LocationPicker;
