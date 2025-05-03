import { useState } from 'react';
import ProjectModal from '../../components/PackageModal/PackageModal';
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
        <ProjectModal />
      )}
    </main>
  );
};

export default Home;