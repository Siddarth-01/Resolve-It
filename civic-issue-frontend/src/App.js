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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
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
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Resolve-It
              </h3>
              <p className="text-gray-600 mb-4">
                Empowering citizens to report and track civic issues
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <span>© 2024 Resolve-It. All rights reserved.</span>
                <span>•</span>
                <span>Built with ❤️ for better communities</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
