import React, { useState } from "react";
import IssueMap from "./IssueMap";

const MapDemo = () => {
  const [coordinates, setCoordinates] = useState({
    lat: 40.7128,
    lng: -74.006,
  });

  const predefinedLocations = [
    { name: "New York City", lat: 40.7128, lng: -74.006 },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
    { name: "Chicago", lat: 41.8781, lng: -87.6298 },
    { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
  ];

  const handleLocationChange = (location) => {
    setCoordinates(location);
  };

  const handleCustomCoordinates = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const lat = parseFloat(formData.get("lat"));
    const lng = parseFloat(formData.get("lng"));

    if (!isNaN(lat) && !isNaN(lng)) {
      setCoordinates({ lat, lng });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Interactive Map Component Demo
        </h2>

        {/* Current Map */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Current Location: {coordinates.lat.toFixed(4)},{" "}
            {coordinates.lng.toFixed(4)}
          </h3>
          <IssueMap lat={coordinates.lat} lng={coordinates.lng} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Predefined Locations */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Quick Locations
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {predefinedLocations.map((location) => (
                <button
                  key={location.name}
                  onClick={() => handleLocationChange(location)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow text-sm transition-colors"
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Coordinates */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Custom Coordinates
            </h4>
            <form onSubmit={handleCustomCoordinates} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  name="lat"
                  step="any"
                  defaultValue={coordinates.lat}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 40.7128"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  name="lng"
                  step="any"
                  defaultValue={coordinates.lng}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., -74.0060"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow transition-colors"
              >
                Update Map
              </button>
            </form>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Map Features:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Interactive Leaflet map with OpenStreetMap tiles</li>
            <li>• Marker positioned at specified coordinates</li>
            <li>• Fixed height (h-64) with rounded corners</li>
            <li>• Popup showing exact coordinates</li>
            <li>• Scroll wheel zoom disabled for better UX in modals</li>
            <li>• Responsive design with proper mobile support</li>
            <li>• Customizable styling through className prop</li>
          </ul>
        </div>

        {/* Usage Example */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Usage Example:</h4>
          <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">
            {`<IssueMap 
  lat={${coordinates.lat}} 
  lng={${coordinates.lng}} 
  className="custom-styling"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MapDemo;
