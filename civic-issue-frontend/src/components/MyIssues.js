import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import StatusTracker from "./StatusTracker";
import IssueDetailModal from "./IssueDetailModal";
import Badge from "./Badge";
import LoadingSpinner from "./LoadingSpinner";
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

  // Function to get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "In Progress":
        return "primary";
      case "Resolved":
        return "success";
      default:
        return "default";
    }
  };

  // Function to get category badge variant
  const getCategoryBadgeVariant = (category, predictedCategory, confidence) => {
    if (predictedCategory && confidence > 0.5) {
      return "ai";
    } else if (category) {
      return "default";
    }
    return "default";
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
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-16">
          <LoadingSpinner size="xl" text="Loading your issues..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          My Civic Issues
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track and monitor all your reported civic issues and their current
          status
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
          <h2 className="text-2xl font-semibold text-white">Issue Dashboard</h2>
          <p className="text-green-100 mt-1">
            Monitor your reported issues and their progress
          </p>
        </div>

        {/* Issues Count */}
        <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Total Issues:{" "}
                  <span className="font-bold text-blue-600">
                    {issues.length}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Pending:{" "}
                  <span className="font-bold text-yellow-600">
                    {issues.filter((i) => i.status === "Pending").length}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Resolved:{" "}
                  <span className="font-bold text-green-600">
                    {issues.filter((i) => i.status === "Resolved").length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container - Responsive */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Issue Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date Reported
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr
                  key={issue._id}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                >
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {issue.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {issue.description.length > 60
                            ? `${issue.description.substring(0, 60)}...`
                            : issue.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      {issue.predictedCategory &&
                      issue.categoryConfidence > 0.5 ? (
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={getCategoryBadgeVariant(
                              issue.category,
                              issue.predictedCategory,
                              issue.categoryConfidence
                            )}
                          >
                            🤖 {issue.predictedCategory}
                          </Badge>
                          <span className="text-xs text-gray-500 font-medium">
                            {Math.round(issue.categoryConfidence * 100)}%
                          </span>
                        </div>
                      ) : issue.category ? (
                        <Badge
                          variant={getCategoryBadgeVariant(
                            issue.category,
                            issue.predictedCategory,
                            issue.categoryConfidence
                          )}
                        >
                          {issue.category}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Uncategorized
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(issue.status)}>
                      {issue.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-6">
                    <StatusTracker status={issue.status} />
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(issue.createdAt)}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <button
                      onClick={() => handleViewIssue(issue)}
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-4 py-2.5 shadow-lg hover:shadow-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {issues.length === 0 && !loading && (
          <div className="text-center py-16 px-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No issues reported yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start making a difference in your community by reporting your
              first civic issue.
            </p>
            <Link
              to="/"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Report Your First Issue
            </Link>
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
