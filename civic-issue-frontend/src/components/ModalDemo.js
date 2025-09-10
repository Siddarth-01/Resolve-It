import React, { useState } from "react";
import Modal from "./Modal";

const ModalDemo = () => {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Reusable Modal Component Demo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Modal Demo */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Basic Modal
            </h3>
            <button
              onClick={() => setIsBasicModalOpen(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Open Basic Modal
            </button>
          </div>

          {/* Form Modal Demo */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Form Modal
            </h3>
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Open Form Modal
            </button>
          </div>

          {/* Confirmation Modal Demo */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Confirm Modal
            </h3>
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Open Confirm Modal
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Modal Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Dark semi-transparent backdrop</li>
            <li>• White card with padding and rounded corners</li>
            <li>• Close button (X) in top-right corner</li>
            <li>• ESC key support for closing</li>
            <li>• Click outside to close</li>
            <li>• Body scroll prevention when open</li>
            <li>• Customizable with className prop</li>
            <li>• Fully accessible with ARIA labels</li>
          </ul>
        </div>
      </div>

      {/* Basic Modal */}
      <Modal
        isOpen={isBasicModalOpen}
        onClose={() => setIsBasicModalOpen(false)}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Modal</h3>
        <p className="text-gray-700 mb-4">
          This is a simple modal with basic content. You can close it by:
        </p>
        <ul className="text-gray-700 mb-6 list-disc list-inside space-y-1">
          <li>Clicking the X button</li>
          <li>Pressing the ESC key</li>
          <li>Clicking outside the modal</li>
        </ul>
        <div className="flex justify-end">
          <button
            onClick={() => setIsBasicModalOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        className="max-w-md"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Example Form</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your message"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        className="max-w-sm"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
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
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Item?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert("Item deleted!");
                setIsConfirmModalOpen(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalDemo;
