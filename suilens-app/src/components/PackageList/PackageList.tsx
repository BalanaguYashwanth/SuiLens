import React from 'react';
import PackageCard from '../../components/PackageCard/PackageCard';
import { Package } from '../../common/types';
import './PackageList.scss';

interface PackageListProps {
  packages: Package[];
}

const PackageList: React.FC<PackageListProps> = ({ packages }) => {
  return (
    <div className="packages-container">
      {packages.length === 0 ? (
        <div className="empty-state">
          <p>No Packages Found</p>
          <p className="hint">Click "Create Package" to get started</p>
        </div>
      ) : (
        <div className="package-grid">
          {packages.map((pkg) => (
            <PackageCard 
              key={`${pkg.id}-${pkg.module}`} 
              package={pkg}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PackageList;