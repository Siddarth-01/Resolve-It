import React, { useState } from "react";
import StatusTracker from "./StatusTracker";
import Modal from "./Modal";
import IssueMap from "./IssueMap";
import toast from "react-hot-toast";

const AdminIssueDetailModal = ({
  issue,
  isOpen,
  onClose,
  onUpdate,
  userProfiles,
  userEmail,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(
    issue?.status || "Pending"
  );
  const [adminNote, setAdminNote] = useState(issue?.adminNote || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset form when issue changes
  React.useEffect(() => {
    if (issue) {
      setSelectedStatus(issue.status || "Pending");
      setAdminNote(issue.adminNote || "");
    }
  }, [issue]);

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

  const getCitizenInfo = (userId) => {
    if (!userId) {
      return { name: "Unknown User", email: "N/A" };
    }

    const profile = userProfiles[userId];
    if (profile) {
      return {
        name: profile.displayName || "Citizen",
        email: profile.email || "No email provided",
        uid: userId,
      };
    }

    // If profile is missing, show explicit unknown values
    return {
      name: "Unknown User",
      email: "No email",
      uid: userId,
    };
  };

  const getStatusBadge = (status) => {
    const baseClasses = "rounded-full px-3 py-1 text-sm font-medium";

    switch (status) {
      case "Pending":
        return `${baseClasses} bg-yellow-200 text-yellow-800`;
      case "In Progress":
        return `${baseClasses} bg-blue-200 text-blue-800`;
      case "Resolved":
        return `${baseClasses} bg-green-200 text-green-800`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-800`;
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);

      const response = await fetch(
        `http://localhost:3001/api/admin/issues/${issue._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
            adminNote: adminNote.trim(),
            email: userEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Call the parent update function to refresh the list
      if (onUpdate) {
        onUpdate(data.issue);
      }

      toast.success(`Issue status updated to ${selectedStatus}`);

      // Close modal after successful update
      onClose();
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast.error("Failed to update issue status");
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges =
    selectedStatus !== issue.status ||
    adminNote.trim() !== (issue.adminNote || "");

  const citizenInfo = getCitizenInfo(issue.userId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {/* Modal Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Admin - Issue Details
            </h2>
            <p className="text-gray-600 mt-1">
              Review and manage this civic issue
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={getStatusBadge(issue.status)}>{issue.status}</span>
          </div>
        </div>
      </div>

      {/* Image Section */}
      {issue.imageUrl ? (
        <div className="mb-6">
          <img
            src={`http://localhost:3001${issue.imageUrl}`}
            alt="Issue"
            className="w-full max-h-80 object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "block";
            }}
          />
          <div className="text-gray-500 text-sm hidden mt-2">
            Image could not be loaded: {issue.imageUrl}
          </div>
        </div>
      ) : (
        <div className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mb-6 py-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 mt-2">No image uploaded</p>
        </div>
      )}

      {/* Modal Content */}
      <div className="space-y-6">
        {/* Issue Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {issue.title}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {issue.description}
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <p className="text-gray-700">
                {issue.category || "Uncategorized"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Citizen Information */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-blue-800 mb-3">
                Citizen Information
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-blue-900 font-medium">
                    {citizenInfo.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-blue-700">{citizenInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
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
              <p className="text-gray-500 font-mono text-sm break-all">
                {issue._id}
              </p>
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Current Progress
          </label>
          <div className="bg-gray-50 p-4 rounded-lg border">
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
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700 font-mono text-sm">
                  {formatLocation(issue.location)}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${issue.location.lat},${issue.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
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
            <p className="text-gray-500 italic bg-gray-50 p-3 rounded-lg">
              No location data available
            </p>
          )}
        </div>

        {/* Admin Actions */}
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-900 mb-4">
            Admin Actions
          </h3>

          <div className="space-y-4">
            {/* Status Update */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Admin Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Note (Optional)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add internal notes about this issue..."
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg px-4 py-2 transition-colors"
          >
            Cancel
          </button>

          <div className="flex space-x-3">
            {hasChanges && (
              <span className="text-sm text-amber-600 flex items-center">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Unsaved changes
              </span>
            )}

            <button
              onClick={handleUpdateStatus}
              disabled={!hasChanges || isUpdating}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                hasChanges && !isUpdating
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isUpdating ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
                  Updating...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdminIssueDetailModal;
