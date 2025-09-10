import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/issues/stats/${currentUser.uid}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        toast.error("Failed to load issues");
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 space-y-8">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex-shrink-0">
              <img
                className="h-24 w-24 rounded-full object-cover border-4 border-gray-100 shadow-md"
                src={
                  currentUser.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentUser.displayName || currentUser.email
                  )}&size=96&background=3B82F6&color=ffffff`
                }
                alt={currentUser.displayName || "User"}
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentUser.displayName || "User"}
              </h1>
              <p className="text-lg text-gray-600 mb-1">{currentUser.email}</p>
              <p className="text-sm text-gray-500">
                Member since{" "}
                {new Date(
                  currentUser.metadata.creationTime
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Issue Statistics
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {!loading && !error && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Issues Card */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-t-4 border-gray-500">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-white"
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
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Issues
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>

              {/* Pending Issues Card */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-t-4 border-yellow-500">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Pending
                  </p>
                  <p className="text-4xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
              </div>

              {/* In Progress Issues Card */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-t-4 border-blue-500">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    In Progress
                  </p>
                  <p className="text-4xl font-bold text-blue-600">
                    {stats.inProgress}
                  </p>
                </div>
              </div>

              {/* Resolved Issues Card */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-t-4 border-green-500">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Resolved
                  </p>
                  <p className="text-4xl font-bold text-green-600">
                    {stats.resolved}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
