import React from "react";

interface LoadingScreenProps {
  message?: string; // Optional loading message
  isFullScreen?: boolean; // Fullscreen mode or inline
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  isFullScreen = false,
}) => {
  return (
    <div
      className={`${
        isFullScreen
          ? "fixed inset-0 flex items-center justify-center bg-gray-50/90 z-50"
          : "flex items-center justify-center py-10"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>

        {/* Message */}
        {message && (
          <p className="text-gray-700 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
