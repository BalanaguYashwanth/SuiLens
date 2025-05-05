import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageFormProps } from '../../common/types';
import { PAGE_ROUTES } from '../../common/constant';
import Loader from '../Loader/Loader';
import './PackageForm.scss';

const PackageForm: React.FC<PackageFormProps> = () => {
  const naviagate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [packageAddress, setPackageAddress] = useState('');
  const [packageName, setPackageName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      localStorage.setItem('module',packageName)
      //TODO - Add request to the backend
      // await createPackage({packageAddress, packageName})
      setTimeout(() => {
        setIsLoading(false)
        naviagate(`${PAGE_ROUTES.DASHBOARD}/${packageAddress}`)
      }, 5000)

    } catch (error: any) {
      console.log('Error occured in adding package', error)
      setError(error)
    }
  };

  if (isLoading) {
    <Loader />
  }

  return (
    <div className="package-form">
      <div className="form-group">
        <label htmlFor="package-address">Package Address</label>
        <input
          id="package-address"
          className={`form-input ${error ? 'error' : ''}`}
          placeholder="Enter smartcontract package address"
          value={packageAddress}
          onChange={(e) => setPackageAddress(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="package-module">Package Name</label>
        <input
          id="package-module"
          className={`form-input ${error ? 'error' : ''}`}
          placeholder="Enter module or package name"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      <button className="form-submit-button" onClick={handleSubmit}>
        Track
      </button>
    </div>
  );
};

export default PackageForm;