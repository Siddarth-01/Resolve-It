import React from "react";

const StatusTracker = ({ status }) => {
  const steps = ["Pending", "In Progress", "Resolved"];

  const getStepIndex = (status) => {
    return steps.indexOf(status);
  };

  const currentStepIndex = getStepIndex(status);

  const getStepStyles = (stepIndex) => {
    const isCompleted = stepIndex <= currentStepIndex;

    if (isCompleted) {
      return {
        circle: "bg-green-500 text-white border-green-500",
        text: "text-green-700 font-medium",
        line: "bg-green-500",
      };
    } else {
      return {
        circle: "bg-gray-200 text-gray-500 border-gray-300",
        text: "text-gray-500",
        line: "bg-gray-300",
      };
    }
  };

  return (
    <div className="flex items-center w-full max-w-md mx-auto">
      {steps.map((step, index) => {
        const stepStyles = getStepStyles(index);
        const isLastStep = index === steps.length - 1;
        const isCompleted = index <= currentStepIndex;

        return (
          <div key={step} className="flex items-center flex-1">
            {/* Step Circle and Label */}
            <div className="flex flex-col items-center">
              {/* Circle with check mark or number */}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${stepStyles.circle}`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <span className={`text-xs mt-2 text-center ${stepStyles.text}`}>
                {step}
              </span>
            </div>

            {/* Connecting Line (except for last step) */}
            {!isLastStep && (
              <div className="flex-1 mx-2">
                <div className={`h-0.5 ${stepStyles.line}`}></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTracker;
