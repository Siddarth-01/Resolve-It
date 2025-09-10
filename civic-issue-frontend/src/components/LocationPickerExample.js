import React, { useState } from "react";
import LocationPicker from "./LocationPicker";

// Example usage of the LocationPicker component
const LocationPickerExample = () => {
  const [coordinates, setCoordinates] = useState({
    lat: 40.7128, // Default to New York City
    lng: -74.006,
  });

  const handleLocationChange = (lat, lng) => {
    console.log("Location changed:", { lat, lng });
    setCoordinates({ lat, lng });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        LocationPicker Component Example
      </h2>

      {/* Display current coordinates */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Current Location:</strong> {coordinates.lat.toFixed(6)},{" "}
          {coordinates.lng.toFixed(6)}
        </p>
      </div>

      {/* LocationPicker Component */}
      <LocationPicker
        lat={coordinates.lat}
        lng={coordinates.lng}
        onChange={handleLocationChange}
        className="shadow-lg"
      />

      {/* Usage Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Drag the marker to a new location</li>
          <li>• Click anywhere on the map to move the marker</li>
          <li>• The coordinates will update automatically</li>
          <li>• Height is set to 300px with rounded corners</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationPickerExample;
