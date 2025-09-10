import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import StatusTracker from "./StatusTracker";
import IssueDetailModal from "./IssueDetailModal";
import toast from "react-hot-toast";

const MyIssues = () => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);

        // Don't fetch if user is not logged in
        if (!currentUser) {
          setIssues([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:3001/api/issues?userId=${currentUser.uid}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // No need to filter here anymore since backend does the filtering
        setIssues(data);
      } catch (err) {
        console.error("Error fetching issues:", err);
        toast.error("Failed to load issues");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [currentUser]);

  // Function to get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "rounded-full px-3 py-1 text-xs font-medium";

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

  // Function to format date into human-readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format: 09 Sep 2025, 2:15 PM
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

  // Handle opening issue detail modal
  const handleViewIssue = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <svg
                className="h-12 w-12 text-red-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-red-600 font-medium">Error loading issues</p>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mb-4"
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
              <p className="text-gray-600">Loading issues...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">My Civic Issues</h2>
          <p className="text-gray-600 mt-1">
            View and track your reported civic issues and their current status
          </p>
        </div>

        {/* Issues Count */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            My Issues: <span className="font-semibold">{issues.length}</span>
          </p>
        </div>

        {/* Table Container - Responsive */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Reported
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr
                  key={issue._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {issue.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {issue.category || "Uncategorized"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(issue.status)}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusTracker status={issue.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(issue.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewIssue(issue)}
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow text-sm font-medium transition-colors"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {issues.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No issues reported yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start by reporting your first civic issue in your community.
            </p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-sm">
                  {issues.filter((issue) => issue.status === "Pending").length}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                My Pending Issues
              </p>
              <p className="text-xs text-yellow-600">Awaiting review</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">
                  {
                    issues.filter((issue) => issue.status === "In Progress")
                      .length
                  }
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                My In Progress
              </p>
              <p className="text-xs text-blue-600">Being worked on</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">
                  {issues.filter((issue) => issue.status === "Resolved").length}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">My Resolved</p>
              <p className="text-xs text-green-600">Successfully completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MyIssues;
