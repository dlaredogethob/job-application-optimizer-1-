import React from 'react';

export const LaredoLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <img
      src="/laredo_logo.png"
      alt="Laredo Engineering"
      className={`h-12 object-contain ${className}`}
    />
  );
};

export const FixedLaredoLogo: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50 transition-opacity pointer-events-none">
      <LaredoLogo className="h-16 drop-shadow-lg" />
    </div>
  );
};
