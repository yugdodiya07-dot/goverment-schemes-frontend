import React from 'react';

const Loader = ({ text = 'Loading GovSmart Portal...', fullScreen = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-warning"
        style={{ width: '3.2rem', height: '3.2rem', borderWidth: '4px' }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-3 fw-semibold text-muted">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="d-flex align-items-center justify-content-center w-100"
        style={{ minHeight: '80vh' }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
