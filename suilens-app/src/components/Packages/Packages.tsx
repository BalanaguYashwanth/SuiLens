import {useState } from 'react';
import PackageCard from '../PackageCard/PackageCard';
import './Packages.scss';

const Packages = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [packageList, setPackageList] = useState([
    {packageAddress:'0xa93c09ef153ecfb7353c7a2e3059f769711a04fc63f8cbc64d23dccab1bacf1a', packageName:'forms_escrow'}
  ])

  //TODO - make this package request to backend
  // const loadPackages = async () => {
    // setIsLoading(true);
    // try {
    //   const response = await getProjectsByEmail();
    //   if (response.success && Array.isArray(response.projects)) {
    //     setPackages(response.projects.map((project: any) => ({
    //       id: project.id,
    //       name: project.name
    //     })));
    //   } else {
    //     setPackages([]);
    //   }
    // } catch (error) {
    //   console.error("Failed to fetch projects:", error);
    //   setPackages([]);
    // }
    // setIsLoading(false);
  // }

  // useEffect(() => {
  //   loadPackages();
  // }, []);

  return (
    <div className={`package-container ${packageList.length === 0 ? 'empty' : ''}`}>
      {packageList.length === 0 ? (
        <div className="empty-state">
          <p>No Packages Found</p>
          <p className="hint">Click "Add Package" to get started</p>
        </div>
      ) : (
        <div className="package-grid">
          {packageList.map((pkg: any) => (
            <PackageCard
              key={pkg.packageAddress}
              pkg={pkg}
            />
            
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;