import React, { useState, useEffect } from "react";

// Dummy data - hardcoded list of issues
const dummyIssues = [
  {
    id: 1,
    title: "Broken streetlight on Main Street",
    category: "Infrastructure",
    status: "Pending",
    date: "2025-09-08",
  },
  {
    id: 2,
    title: "Pothole near City Park entrance",
    category: "Roads",
    status: "In Progress",
    date: "2025-09-07",
  },
  {
    id: 3,
    title: "Overflowing garbage bin at Bus Stop #12",
    category: "Sanitation",
    status: "Resolved",
    date: "2025-09-05",
  },
  {
    id: 4,
    title: "Graffiti on community center wall",
    category: "Vandalism",
    status: "Pending",
    date: "2025-09-06",
  },
  {
    id: 5,
    title: "Damaged traffic signal at Oak & Pine intersection",
    category: "Traffic",
    status: "In Progress",
    date: "2025-09-04",
  },
  {
    id: 6,
    title: "Broken playground equipment - swing set",
    category: "Parks & Recreation",
    status: "Resolved",
    date: "2025-09-03",
  },
  {
    id: 7,
    title: "Water leak from fire hydrant",
    category: "Water & Utilities",
    status: "Pending",
    date: "2025-09-09",
  },
  {
    id: 8,
    title: "Missing stop sign at residential intersection",
    category: "Traffic",
    status: "In Progress",
    date: "2025-09-02",
  },
];

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    const fetchIssues = () => {
      setTimeout(() => {
        setIssues(dummyIssues);
        setLoading(false);
      }, 1000); // Simulate loading time
    };

    fetchIssues();
  }, []);

  // Function to get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "In Progress":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "Resolved":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
              <p className="text-gray-600">Loading your issues...</p>
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
          <h2 className="text-2xl font-bold text-gray-800">
            My Reported Issues
          </h2>
          <p className="text-gray-600 mt-1">
            Track the status of your civic issue reports
          </p>
        </div>

        {/* Issues Count */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            Total Issues: <span className="font-semibold">{issues.length}</span>
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
                  Date Reported
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {issue.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {issue.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(issue.status)}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(issue.date)}
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
              No issues reported
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by reporting your first civic issue.
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
                Pending Issues
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
              <p className="text-sm font-medium text-blue-800">In Progress</p>
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
              <p className="text-sm font-medium text-green-800">Resolved</p>
              <p className="text-xs text-green-600">Successfully completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyIssues;
