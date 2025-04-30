import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCardProps } from '../../common/types';
import './PackageCard.scss'; 

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/${pkg.id}`);
  };

  return (
    <div className="package-card" onClick={handleClick}>
      <div className='package-name'>{pkg.name}</div>
      <div className='package-module'>{pkg.module}</div>
    </div>  
  )
};

export default PackageCard;