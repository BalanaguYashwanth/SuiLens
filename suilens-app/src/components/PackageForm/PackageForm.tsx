import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvents, createPackage } from '../../common/api.services';
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
      setIsLoading(true);
      localStorage.setItem('module',packageName);
      await createEvents({packageId: packageAddress, module: packageName})
      await createPackage({packageAddress, packageName});
      setIsLoading(false)
      naviagate(`${PAGE_ROUTES.DASHBOARD}/${packageAddress}`)
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
        {error && <div className="error-message">{String(error)}</div>}
      </div>
      {/* todo */}
       {/* <hr />
      <p> Add  npm package details </p>
      <p className=''> npm i suilens-sdk</p>
      <code style={{backgroundColor:'lightgray', padding: 10, borderRadius:10}}>
        {`import { Client } from 'suilens-sdk'
        const suiClient = new Client()
        suiClient.init()`}
        </code> */}
      
      <button className="form-submit-button" onClick={handleSubmit}>
        Track
      </button>
    </div>
  );
};

export default PackageForm;