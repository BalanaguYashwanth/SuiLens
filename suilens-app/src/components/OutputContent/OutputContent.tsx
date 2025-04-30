import React from 'react';
import { FiCopy } from 'react-icons/fi';
import { OutputContentProps } from '../../common/types';
import './OutputContent.scss';

const OutputContent: React.FC<OutputContentProps> = ({ id, url }) => {
  const [copiedId, setCopiedId] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState(false);

  const copyToClipboard = (text: string, type: 'id' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="output-content">
      <div className="output-item">
        <div className="output-label">Project ID</div>
        <div className="output-value-container">
          <code className="output-value">{id}</code>
          <button 
            className={`copy-button ${copiedId ? 'copied' : ''}`}
            onClick={() => copyToClipboard(id, 'id')}
          >
             {FiCopy({})}
            <span className="tooltip">{copiedId ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="output-item">
        <div className="output-label">API URL</div>
        <div className="output-value-container">
          <code className="output-value">{url}</code>
          <button 
            className={`copy-button ${copiedUrl ? 'copied' : ''}`}
            onClick={() => copyToClipboard(url, 'url')}
          >
             {FiCopy({})}
            <span className="tooltip">{copiedUrl ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="instruction">
        Add this URL to your root <code>.env</code> file
      </div>
    </div>
  );
};

export default OutputContent;