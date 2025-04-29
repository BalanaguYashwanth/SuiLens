import { useEffect, useState } from 'react';
import { getProjectsByEmail } from '../../common/api.services';
import ProjectModal from '../../components/ProjectModal/ProjectModal';
import ProjectList from '../../components/ProjectList/ProjectList';
import Loader from '../../components/Loader/Loader';
import './Project.scss';

const Project = () => {
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const loadProjects = async () => {
    setIsProjectsLoading(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if(currentUser.email) {
      try { 
        const response = await getProjectsByEmail(encodeURIComponent(currentUser.email));
        if (response.success && Array.isArray(response.projects)) {
          setProjectNames(response.projects.map((project: any) => project.name));
        } else {
          setProjectNames([]);
        }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjectNames([]); 
    }
  } else {
    setProjectNames([]); 
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

      <ProjectList projects={projectNames} />

      {isModalVisible && (
        <ProjectModal onClose={() => setIsModalVisible(false)} setProjects={setProjectNames} />
      )}
    </div>
  );
};

export default Project;