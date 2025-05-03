import { useState } from 'react';
import PackageModal from '../../components/PackageModal/PackageModal';
import Packages from '../../components/Packages/Packages';
import './Home.scss';

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <main className="home-page">
      <div className="home-header">
        <button onClick={() => setIsModalVisible(true)}>Add Package</button>
      </div>
      <Packages />
      {isModalVisible && (
        <PackageModal />
      )}
    </main>
  );
};

export default Home;