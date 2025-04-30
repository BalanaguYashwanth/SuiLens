import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectCardProps } from '../../common/types';
import './ProjectCard.scss';

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project.id}/home`);
  };

  return (
    <div className="project-card" onClick={handleClick}>
      <div className='project-name'>{project.name}</div>
    </div>  
  )
};

export default ProjectCard;