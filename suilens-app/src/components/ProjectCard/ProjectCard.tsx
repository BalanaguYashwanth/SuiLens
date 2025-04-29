import React from 'react';
import { ProjectCardProps } from '../../common/types';
import './ProjectCard.scss';

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return <div className="project-box">{project}</div>;
};

export default ProjectCard;