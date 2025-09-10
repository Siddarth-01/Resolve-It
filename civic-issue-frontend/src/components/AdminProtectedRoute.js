import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isAdminEmail } from "../config/adminEmails";

const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect if still loading
    if (loading) return;

    // If no user is logged in, redirect to login
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // If user is logged in but not an admin, redirect to home
    if (!isAdminEmail(currentUser.email)) {
      navigate("/");
      return;
    }
  }, [currentUser, loading, navigate]);

  // Show loading state while checking authentication
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
              <p className="text-gray-600">Verifying admin access...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated or not admin
  // (redirect will happen in useEffect)
  if (!currentUser || !isAdminEmail(currentUser.email)) {
    return null;
  }

  // Render the protected content
  return children;
};

export default AdminProtectedRoute;
