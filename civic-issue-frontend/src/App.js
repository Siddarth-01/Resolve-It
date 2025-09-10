import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IssueForm from "./components/IssueForm";
import MyIssues from "./components/MyIssues";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import CitizenProtectedRoute from "./components/CitizenProtectedRoute";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="py-8">
          <Routes>
            <Route
              path="/"
              element={
                <CitizenProtectedRoute>
                  <IssueForm />
                </CitizenProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-issues"
              element={
                <CitizenProtectedRoute>
                  <MyIssues />
                </CitizenProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
