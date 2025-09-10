import React from "react";
import StatusTracker from "./StatusTracker";
import Modal from "./Modal";
import IssueMap from "./IssueMap";

const IssueDetailModal = ({ issue, isOpen, onClose }) => {
  if (!isOpen || !issue) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate}, ${formattedTime}`;
  };

  const formatLocation = (location) => {
    if (!location || !location.lat || !location.lng) {
      return "Location not provided";
    }
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Modal Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Issue Details</h2>
        <p className="text-gray-600 mt-1">
          View complete information about this civic issue
        </p>
      </div>

      {/* Image Section - Moved to top */}
      {issue.imageUrl ? (
        <img
          src={`http://localhost:3001${issue.imageUrl}`}
          alt="Issue"
          className="w-full max-h-80 object-cover rounded-lg mb-4"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextElementSibling.style.display = "block";
          }}
        />
      ) : (
        <div className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mb-4 py-8 text-center">
          <p className="text-gray-500">No image uploaded</p>
        </div>
      )}
      <div className="text-gray-500 text-sm hidden">
        Image could not be loaded: {issue.imageUrl}
      </div>

      {/* Modal Content */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Title
          </label>
          <p className="text-lg font-semibold text-gray-900">{issue.title}</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {issue.description}
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <p className="text-gray-700">{issue.category || "Uncategorized"}</p>
        </div>

        {/* Status Tracker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Current Progress
          </label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <StatusTracker status={issue.status} />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>

          {issue.location && issue.location.lat && issue.location.lng ? (
            <div className="space-y-3">
              {/* Interactive Map */}
              <IssueMap lat={issue.location.lat} lng={issue.location.lng} />

              {/* Coordinates and Google Maps Link */}
              <div className="flex items-center justify-between">
                <p className="text-gray-700 font-mono text-sm">
                  {formatLocation(issue.location)}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${issue.location.lat},${issue.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No location data available</p>
          )}
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Reported
            </label>
            <p className="text-gray-700">{formatDate(issue.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Updated
            </label>
            <p className="text-gray-700">{formatDate(issue.updatedAt)}</p>
          </div>
        </div>

        {/* Issue ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue ID
          </label>
          <p className="text-gray-500 font-mono text-sm">{issue._id}</p>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default IssueDetailModal;
