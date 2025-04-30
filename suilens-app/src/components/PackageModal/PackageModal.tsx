import { useState } from 'react';
import PackageForm from '../PackageForm/PackageForm';
import Loader from '../Loader/Loader';
import './PackageModal.scss';

interface PackageModalProps {
  onClose: () => void;
  onSubmit: (id: string, module: string) => void;
}

const PackageModal: React.FC<PackageModalProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (id: string, module: string) => {
    setIsLoading(true);
    try {
      await onSubmit(id, module);
      onClose();
    } catch (error) {
      console.error("Error creating package:", error);
    } finally {
      setIsLoading(false);
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
          <h2>Create Package</h2>
          <PackageForm
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default PackageModal;