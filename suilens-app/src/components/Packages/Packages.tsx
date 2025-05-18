import { useState, useEffect } from 'react';
import PackageCard from '../PackageCard/PackageCard';
import { getPackagesByEmail } from '../../common/api.services';
import './Packages.scss';

const Packages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [packageList, setPackageList] = useState<any[]>([]);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const response = await getPackagesByEmail();
      if (response.success && Array.isArray(response.packages)) {
        setPackageList(response.packages.map((pkg: any) => ({
          packageAddress: pkg.package_address,
          packageName: pkg.package_name,
        })));
      } else {
        setPackageList([]);
      }
    } catch (error) {
      console.error("Failed to fetch package:", error);
      setPackageList([]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <div className={`package-container ${packageList.length === 0 ? 'empty' : ''}`}>
      {isLoading ? (
        <p>Loading Packages...</p>
      ) : packageList.length === 0 ? (
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