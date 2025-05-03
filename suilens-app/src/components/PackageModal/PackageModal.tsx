import PackageForm from '../PackageForm/PackageForm';
import './PackageModal.scss';

const PackageModal = ({ onClose }: any) => {

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-content">
          <h2> Add package to track analytics </h2>
          <PackageForm />
        </div>
      </div>
    </div>
  );
};

export default PackageModal;