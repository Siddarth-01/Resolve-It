import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import AdminIssueDetailModal from "./AdminIssueDetailModal";
import { useAuth } from "../contexts/AuthContext";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalIssues: 0,
    limit: 10,
  });
  const [userProfiles, setUserProfiles] = useState({});

  // Fetch user profiles from Firebase (for citizen names)
  const fetchUserProfiles = useCallback(async (userIds) => {
    try {
      const profiles = {};

      // Since we don't have direct access to Firebase Admin SDK in frontend,
      // we'll use the userId as display name for now
      // In a real app, you'd have an API endpoint to fetch user profiles
      userIds.forEach((userId) => {
        if (userId) {
          profiles[userId] = {
            displayName: `User ${userId.slice(-6)}`, // Show last 6 chars of userId
            email: `user-${userId.slice(-6)}@example.com`,
          };
        }
      });

      setUserProfiles(profiles);
    } catch (err) {
      console.error("Error fetching user profiles:", err);
      // Don't fail the whole component if user profiles fail
    }
  }, []);

  // Fetch issues from backend
  const fetchIssues = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3001/api/admin/issues?page=${page}&limit=10&email=${currentUser?.email}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setIssues(data.issues);
        setPagination(data.pagination);

        // Fetch user profiles for citizen names
        const userIds = [
          ...new Set(data.issues.map((issue) => issue.userId).filter(Boolean)),
        ];
        await fetchUserProfiles(userIds);
      } catch (err) {
        console.error("Error fetching admin issues:", err);
        toast.error("Failed to load issues");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchUserProfiles]
  );

  // Update issue status
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [issueId]: true }));

      const response = await fetch(
        `http://localhost:3001/api/admin/issues/${issueId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            email: currentUser?.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update the issue in the local state
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue._id === issueId ? data.issue : issue))
      );

      toast.success(`Issue status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating issue status:", err);
      toast.error("Failed to update issue status");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [issueId]: false }));
    }
  };

  // Handle update from modal
  const handleModalUpdate = (updatedIssue) => {
    // Update the issue in the local state
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue._id === updatedIssue._id ? updatedIssue : issue
      )
    );
  };

  // Load issues on component mount
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

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

  // Function to format date
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

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchIssues(newPage);
  };

  // Get citizen name
  const getCitizenName = (userId) => {
    if (!userId) {
      return "Unknown User";
    }
    return userProfiles[userId]?.displayName || `User ${userId.slice(-6)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
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
              <p className="text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
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
              <p className="text-red-600 font-medium">
                Error loading dashboard
              </p>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => fetchIssues()}
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-100 mt-1">
            Manage and track all civic issues reported by citizens
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {pagination.totalIssues}
                  </p>
                  <p className="text-sm text-gray-600">Total Issues</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-lg">
                      {
                        issues.filter((issue) => issue.status === "Pending")
                          .length
                      }
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      issues.filter((issue) => issue.status === "Pending")
                        .length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {
                        issues.filter((issue) => issue.status === "In Progress")
                          .length
                      }
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      issues.filter((issue) => issue.status === "In Progress")
                        .length
                    }
                  </p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">
                      {
                        issues.filter((issue) => issue.status === "Resolved")
                          .length
                      }
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-green-600">
                    {
                      issues.filter((issue) => issue.status === "Resolved")
                        .length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citizen Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {issue.title}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {issue.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getCitizenName(issue.userId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(issue.status)}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(issue.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewIssue(issue)}
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 shadow text-xs transition-colors"
                    >
                      <svg
                        className="w-3 h-3 mr-1"
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

                    <select
                      value={issue.status}
                      onChange={(e) =>
                        updateIssueStatus(issue._id, e.target.value)
                      }
                      disabled={updatingStatus[issue._id]}
                      className="inline-block text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    {updatingStatus[issue._id] && (
                      <svg
                        className="inline-block animate-spin h-4 w-4 text-blue-600"
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
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalIssues
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pagination.totalIssues}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

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
              No issues found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No civic issues have been reported yet.
            </p>
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      <AdminIssueDetailModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleModalUpdate}
        userProfiles={userProfiles}
        userEmail={currentUser?.email}
      />
    </div>
  );
};

export default AdminDashboard;
