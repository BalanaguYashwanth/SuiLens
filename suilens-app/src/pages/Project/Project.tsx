import { useEffect, useState } from 'react';
import { getProjectsByEmail } from '../../common/api.services';
import ProjectModal from '../../components/ProjectModal/ProjectModal';
import ProjectList from '../../components/ProjectList/ProjectList';
import { ProjectProp } from '../../common/types';
import Loader from '../../components/Loader/Loader';
import './Project.scss';

const Project = () => {
  const [projects, setProjects] = useState<ProjectProp[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const loadProjects = async () => {
    setIsProjectsLoading(true);
    try { 
      const response = await getProjectsByEmail();
      if (response.success && Array.isArray(response.projects)) {
        setProjects(response.projects.map((project: any) => ({
          id: project.id,
          name: project.name
        }))); 
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]); 
    }
  setIsProjectsLoading(false);
}

  useEffect(() => {
    loadProjects();
  }, []);

  if (isProjectsLoading) return <Loader />;

  return (
    <div className="project-page">
      <div className="project-header">
        <button onClick={() => setIsModalVisible(true)}>Create New Project</button>
      </div>

      <ProjectList projects={projects} />

      {isModalVisible && (
        <ProjectModal onClose={() => setIsModalVisible(false)} setProjects={setProjects} />
      )}
    </div>
  );
};

export default Project;