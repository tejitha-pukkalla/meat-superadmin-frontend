// src/components/common/LoadingSpinner.jsx
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-red-600 font-medium">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;