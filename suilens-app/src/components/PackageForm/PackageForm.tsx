import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvents, createPackage } from '../../common/api.services';
import { PackageFormProps } from '../../common/types';
import { PAGE_ROUTES } from '../../common/constant';
import Loader from '../Loader/Loader';
import { FiCopy } from 'react-icons/fi';
import './PackageForm.scss';

const PackageForm: React.FC<PackageFormProps> = () => {
  const naviagate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [packageAddress, setPackageAddress] = useState('');
  const [packageName, setPackageName] = useState('');
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const CopyIcon = FiCopy as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return <Loader />
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
      <hr />

      <div className="code-section">
        <p className="section-title">Install SDK</p>
        {copiedIndex === 0 && (
          <div className="copied-message-wrapper">
            <span className="copied-message">Copied!</span>
          </div>
        )}
        <div className="code-box">
          <code>npm i suilens-sdk</code>
          <div className="copy-container">
          <button
            className="copy-btn"
            onClick={() => copyToClipboard('npm i suilens-sdk', 0)}
            title="Copy to clipboard"
          >
            <CopyIcon className="copy-icon"  />
          </button>
          </div>
        </div>

        <p className="section-title">Initialize SDK</p>
        {copiedIndex === 1 && (
          <div className="copied-message-wrapper">
            <span className="copied-message">Copied!</span>
          </div>
        )}
        <div className="code-box">
          <pre>
            <code>{`import { Client } from 'suilens-sdk'\nconst suiClient = new Client()\nsuiClient.init()`}</code>
          </pre>
          <div className="copy-container">
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(`import { Client } from 'suilens-sdk'\nconst suiClient = new Client()\nsuiClient.init()`, 1)}
              title="Copy to clipboard"
            >
            <CopyIcon className="copy-icon" />
          </button>
          </div>
        </div>
      </div>

      <button className="form-submit-button" onClick={handleSubmit}>
        Track
      </button>
    </div>
  );
};

export default PackageForm;