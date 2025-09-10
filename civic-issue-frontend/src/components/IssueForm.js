import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

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
  const [imagePreview, setImagePreview] = useState(null);

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
      if (allowedTypes.includes(file.type)) {
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        alert("Please select only JPG or PNG files");
        e.target.value = "";
        setImagePreview(null);
      }
    } else {
      // File was cleared
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
      setImagePreview(null);
    }
  };

  const fetchLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
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
        alert("Unable to fetch location. Please try again.");
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
      alert("You must be logged in to submit an issue");
      return;
    }
    if (!formData.title.trim()) {
      alert("Please enter an issue title");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter an issue description");
      return;
    }

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
        alert("Issue submitted successfully!");

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
        alert(
          `Error submitting issue: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check if the backend server is running.");
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
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
              Upload Image (JPG or PNG only)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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

          {/* Location Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <button
              type="button"
              onClick={fetchLocation}
              disabled={isLoadingLocation}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoadingLocation ? (
                <span className="flex items-center">
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
            {formData.location.latitude && formData.location.longitude && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>Location captured:</strong>
                  <br />
                  Latitude: {formData.location.latitude.toFixed(6)}
                  <br />
                  Longitude: {formData.location.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none transition-colors font-medium text-lg"
            >
              Submit Issue Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueForm;
