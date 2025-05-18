import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCardProps } from '../../common/types';
import './PackageCard.scss'; 

const PackageCard: React.FC<PackageCardProps> = ({ pkg }: PackageCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/${pkg.packageAddress}`);
    localStorage.setItem('module',pkg.packageName)
  };

  return (
    <div className="package-card" onClick={handleClick}>
      <div className='package-name'>{pkg.packageName}</div>
      <div className='package-module'>{`${pkg.packageAddress.slice(0,5)}...${pkg.packageAddress.slice(-3)}`}</div>
    </div>  
  )
};

export default PackageCard;