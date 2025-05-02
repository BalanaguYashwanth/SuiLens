import { useState } from 'react';
import { createProject, getProjectUrl } from '../../common/api.services';
import ProjectForm from '../ProjectForm/ProjectForm';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { ProjectProp } from '../../common/types';
import './ProjectModal.scss';

const ProjectModal = ({ onClose, setProjects }: any) => {
  const [responseData, setResponseData] = useState<{ url: string; id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (name: string, desc: string) => {
    setIsLoading(true);
    try{
      const createResponse = await createProject(name, desc);
      const projectId = createResponse.project_id;

      const urlResponse = await getProjectUrl();
      const url = urlResponse.api_url;

      setResponseData({ url, id: projectId });
      setProjects((prev: ProjectProp[]) => [...prev, { id: projectId, name }]);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOkay = () => {
    onClose();
    if (responseData) {
      navigate(`/projects/${responseData.id}/home`);
    }
  };

  if (isLoading) return (
    <div className="modal-overlay">
      <div className="modal-box">
        <Loader />
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        
        <div className="modal-content">
          <h2>{responseData ? 'Project Created' : 'Create New Project'}</h2>
          <ProjectForm
            mode={responseData ? 'output' : 'input'}
            onSubmit={handleFormSubmit}
            data={responseData || undefined}
          />

        </div>
       <hr />
       <div className="modal-content">
          <h2> Track Onchain </h2>

          <input placeholder='package id'/>
          <input placeholder='name'/>
          {responseData && (
            <button className="modal-action-button" onClick={handleOkay}>
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;