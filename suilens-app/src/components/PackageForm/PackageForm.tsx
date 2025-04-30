import React, { useState } from 'react';
import { PackageFormProps } from '../../common/types';
import './PackageForm.scss';

const PackageForm: React.FC<PackageFormProps> = ({ onSubmit }) => {
  const [id, setId] = useState('');
  const [module, setModule] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!id.trim() || !module.trim()) {
      setError('Both fields are required!');
      return;
    }
    setError('');
    onSubmit?.(id, module);
  };

  return (
    <div className="package-form">
      <div className="form-group">
        <label htmlFor="package-id">Package ID</label>
        <input
          id="package-id"
          className={`form-input ${error ? 'error' : ''}`}
          placeholder="Enter package ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="package-module">Module</label>
        <input
          id="package-module"
          className={`form-input ${error ? 'error' : ''}`}
          placeholder="Enter module name"
          value={module}
          onChange={(e) => setModule(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <button className="form-submit-button" onClick={handleSubmit}>
        Create Package
      </button>
    </div>
  );
};

export default PackageForm;