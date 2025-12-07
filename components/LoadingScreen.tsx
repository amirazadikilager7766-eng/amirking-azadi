import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-4">
        <img 
            src="https://arahonar.com/wp-content/uploads/2025/10/banner-yalda.gif" 
            alt="Loading..." 
            className="w-full rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.5)] border-2 border-yellow-500"
        />
        <p className="text-center mt-6 text-xl font-grunge text-yellow-500 animate-pulse">
            درحال سفر به دنیای کسب‌وکار یلدایی...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;