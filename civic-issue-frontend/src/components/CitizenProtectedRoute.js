import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isAdminEmail } from "../config/adminEmails";

const CitizenProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a moment for auth to settle
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser]);

  // Show loading while checking authentication
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is an admin
  const userIsAdmin = isAdminEmail(currentUser.email);

  // Redirect admins to admin dashboard
  if (userIsAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Allow access for regular citizens
  return children;
};

export default CitizenProtectedRoute;
