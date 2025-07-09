import React from 'react';
import './UpdateToast.scss'; // We'll create this for basic styling

const UpdateToast = ({ onUpdate }) => {
  return (
    <div className="update-toast">
      <p>A new version is available!</p>
      <button onClick={onUpdate} className="update-toast-button">
        Reload
      </button>
    </div>
  );
};

export default UpdateToast;
