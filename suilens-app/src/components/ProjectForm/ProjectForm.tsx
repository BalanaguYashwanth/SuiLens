import React, { useState } from 'react';
import OutputContent from '../OutputContent/OutputContent';
import { ProjectFormProps } from '../../common/types';
import './ProjectForm.scss';

const ProjectForm: React.FC<ProjectFormProps> = ({ mode, onSubmit, data }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Project name is required!');
      return;
    }
    setError('');
    onSubmit?.(name, desc);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error && e.target.value.trim()) {
      setError('');
    }
  };

  if (mode === 'output' && data) {
    return <OutputContent id={data.id} url={data.url} />
  }

  return (
    <div className="project-form">
      <div className="form-group">
        <label htmlFor="project-name">Project Name</label>
        <input
          id="project-name"
          className={`form-input ${error ? 'error' : ''}`}
          placeholder="Enter project name"
          value={name}
          onChange={handleNameChange}
        />
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="project-desc">Description</label>
        <textarea
          id="project-desc"
          className={`form-input ${error ? 'error' : ''}`}
          placeholder="Enter project description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <button className="form-submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default ProjectForm;