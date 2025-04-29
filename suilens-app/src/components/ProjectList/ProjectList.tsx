import React from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { ProjectListProps } from '../../common/types';
import './ProjectList.scss';

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="projects-container">
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No Projects Found</p>
          <p className="hint">Click "Create New Project" to get started</p>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;