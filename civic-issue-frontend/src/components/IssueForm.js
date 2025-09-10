import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import LocationPicker from "./LocationPicker";

const IssueForm = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    location: {
      latitude: null,
      longitude: null,
    },
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [locationMode, setLocationMode] = useState("current"); // "current" or "manual"

  // Auto-detect location when component mounts if current location mode is selected
  useEffect(() => {
    if (
      locationMode === "current" &&
      !formData.location.latitude &&
      !formData.location.longitude
    ) {
      // Try to get current location automatically on component mount
      if (navigator.geolocation) {
        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData((prev) => ({
              ...prev,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            }));
            setIsLoadingLocation(false);
          },
          (error) => {
            console.warn("Could not auto-detect location:", error);
            setIsLoadingLocation(false);
            // Don't show error toast here as it's automatic - user can manually trigger if needed
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000,
          }
        );
      }
    }
  }, [locationMode]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is jpg or png
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select only JPG or PNG files");
        e.target.value = "";
        setImagePreview(null);
        return;
      }

      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be under 5MB");
        e.target.value = "";
        setImagePreview(null);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      // File was cleared
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
      setImagePreview(null);
    }
  };

  const handleLocationModeChange = (mode) => {
    setLocationMode(mode);
    // Reset location when switching modes
    setFormData((prev) => ({
      ...prev,
      location: {
        latitude: null,
        longitude: null,
      },
    }));

    // If switching to manual mode, try to get current location as default
    if (mode === "manual" && navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          setIsLoadingLocation(false);
        },
        (error) => {
          console.warn(
            "Could not auto-detect location for manual mode:",
            error
          );
          setIsLoadingLocation(false);
          // Don't show error toast - user can manually set location
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 60000,
        }
      );
    }
  };

  const handleManualLocationChange = (latitude, longitude) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        latitude,
        longitude,
      },
    }));
  };

  const fetchLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to fetch location. Please try again.");
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!currentUser) {
      toast.error("You must be logged in to submit an issue");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    // Location validation
    if (!formData.location.latitude || !formData.location.longitude) {
      toast.error("Please select a location");
      return;
    }

    // Additional image validation (in case file was modified after initial check)
    if (formData.image) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(formData.image.type)) {
        toast.error("Image must be JPG or PNG format");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (formData.image.size > maxSize) {
        toast.error("Image size must be under 5MB");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("userId", currentUser.uid);

      // Add image file if selected
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Add location as JSON string
      if (formData.location.latitude && formData.location.longitude) {
        formDataToSend.append(
          "location",
          JSON.stringify({
            lat: formData.location.latitude,
            lng: formData.location.longitude,
          })
        );
      }

      // Send data to backend
      const response = await fetch("http://localhost:3001/api/issues", {
        method: "POST",
        body: formDataToSend, // Don't set Content-Type header - browser will set it automatically for FormData
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Issue created:", result);
        toast.success("Issue submitted successfully!");

        // Reset form
        setFormData({
          title: "",
          description: "",
          image: null,
          location: {
            latitude: null,
            longitude: null,
          },
        });

        // Clean up preview URL and reset file input
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }
        const fileInput = document.getElementById("image");
        if (fileInput) fileInput.value = "";
      } else {
        const errorData = await response.json();
        console.error("Error submitting issue:", errorData);
        toast.error(
          `Error submitting issue: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error(
        "Network error. Please check if the backend server is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Report a Civic Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Issue Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-colors"
              placeholder="Enter a brief title for the issue"
              required
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Issue Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-colors resize-vertical"
              placeholder="Provide detailed description of the issue"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Image (Optional - JPG/PNG, max 5MB)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.image && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {formData.image.name}
              </p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-auto rounded-lg shadow"
                />
              </div>
            )}
          </div>

          {/* Location Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Location Selection
            </label>

            {/* Mode Toggle Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleLocationModeChange("current")}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  locationMode === "current"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">📍</span>
                  <span className="font-medium">Get Current Location</span>
                </div>
                <div className="text-xs mt-1 opacity-80">
                  Auto-detect your location
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleLocationModeChange("manual")}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  locationMode === "manual"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🗺️</span>
                  <span className="font-medium">Set Location Manually</span>
                </div>
                <div className="text-xs mt-1 opacity-80">
                  Choose location on map
                </div>
              </button>
            </div>

            {/* Current Location Mode */}
            {locationMode === "current" && (
              <div>
                <button
                  type="button"
                  onClick={fetchLocation}
                  disabled={isLoadingLocation}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingLocation ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Getting Location...
                    </span>
                  ) : (
                    "📍 Get Current Location"
                  )}
                </button>
              </div>
            )}

            {/* Manual Location Mode */}
            {locationMode === "manual" && !isLoadingLocation && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Your location will appear on the map below once detected.
                </p>
              </div>
            )}

            {/* Loading state for manual mode */}
            {locationMode === "manual" && isLoadingLocation && (
              <div className="flex items-center justify-center h-48 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-center">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-sm text-gray-600">
                    Detecting your location...
                  </p>
                </div>
              </div>
            )}

            {/* Location Preview - Always show after location is selected */}
            {formData.location.latitude &&
              formData.location.longitude &&
              !isLoadingLocation && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locationMode === "manual"
                      ? "Adjust Location on Map"
                      : "Location Preview"}
                  </label>
                  {locationMode === "manual" && (
                    <p className="text-sm text-gray-600 mb-2">
                      Click on the map or drag the marker to adjust the
                      location:
                    </p>
                  )}
                  <LocationPicker
                    lat={formData.location.latitude}
                    lng={formData.location.longitude}
                    mode={locationMode === "manual" ? "manual" : "auto"}
                    onChange={
                      locationMode === "manual"
                        ? handleManualLocationChange
                        : undefined
                    }
                  />
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    <strong>Coordinates:</strong>{" "}
                    {formData.location.latitude.toFixed(6)},{" "}
                    {formData.location.longitude.toFixed(6)}
                  </div>
                </div>
              )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Issue Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueForm;
