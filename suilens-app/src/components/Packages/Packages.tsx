import { useEffect, useState } from 'react';
// import ProjectCard from '../ProjectCard/ProjectCard';
import './Packages.scss';

const Packages = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [packageList, setPackageList] = useState([])

  // const loadProjects = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getProjectsByEmail();
  //     if (response.success && Array.isArray(response.projects)) {
  //       setPackages(response.projects.map((project: any) => ({
  //         id: project.id,
  //         name: project.name
  //       })));
  //     } else {
  //       setPackages([]);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch projects:", error);
  //     setPackages([]);
  //   }
  //   setIsLoading(false);
  // }

  // useEffect(() => {
  //   loadPackages();
  // }, []);

  return (
    <div className="package-container">
      <section>
        <h2>No packages found</h2>
      </section>

      {/* {packageList.length === 0 ? (
        <div className="empty-state">
          <p>No Projects Found</p>
          <p className="hint">Click "Create New Project" to get started</p>
        </div>
      ) : (
        <div className="project-grid">
          {packageList.map((package) => (
            <PackageCard 
              key={package.id} 
              project={package}
            />
            
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Packages;