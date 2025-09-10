import React from "react";
import StatusTracker from "./StatusTracker";

const StatusTrackerDemo = () => {
  const demoStatuses = ["Pending", "In Progress", "Resolved"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Status Tracker Component Demo
        </h2>

        <div className="space-y-8">
          {demoStatuses.map((status) => (
            <div
              key={status}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Current Status: <span className="text-blue-600">{status}</span>
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <StatusTracker status={status} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Green check marks for completed steps</li>
            <li>• Numbers for pending steps</li>
            <li>• Connecting lines that change color based on completion</li>
            <li>• Responsive design with Tailwind CSS</li>
            <li>
              • Accepts status prop: "Pending", "In Progress", or "Resolved"
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatusTrackerDemo;
