import React from 'react';

const Loader = ({ fullPage, size = 'medium' }) => {
  const sizeClass = size === 'small' ? 'loader-sm' : size === 'large' ? 'loader-lg' : 'loader-md';

  const loaderContent = (
    <div className="loader-container">
      <div className={`spinner ${sizeClass}`}></div>
      <style>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          width: 100%;
        }
        .spinner {
          border: 4px solid var(--border-color);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .loader-sm {
          width: 24px;
          height: 24px;
          border-width: 2px;
        }
        .loader-md {
          width: 48px;
          height: 48px;
        }
        .loader-lg {
          width: 72px;
          height: 72px;
          border-width: 6px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '80vh',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
