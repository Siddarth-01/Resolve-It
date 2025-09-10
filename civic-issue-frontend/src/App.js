import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IssueForm from "./components/IssueForm";
import MyIssues from "./components/MyIssues";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import StatusTrackerDemo from "./components/StatusTrackerDemo";
import ModalDemo from "./components/ModalDemo";
import MapDemo from "./components/MapDemo";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="py-8">
          <Routes>
            <Route path="/" element={<IssueForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<StatusTrackerDemo />} />
            <Route path="/modal-demo" element={<ModalDemo />} />
            <Route path="/map-demo" element={<MapDemo />} />
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
                <ProtectedRoute>
                  <MyIssues />
                </ProtectedRoute>
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
