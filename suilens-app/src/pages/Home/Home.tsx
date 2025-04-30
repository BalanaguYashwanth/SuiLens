import { useEffect, useState } from "react";
import { createEvents, createPackage, getPackagesByProject } from "../../common/api.services";
import { useNavigate, useParams } from "react-router-dom";
import PackageModal from "../../components/PackageModal/PackageModal";
import PackageList from "../../components/PackageList/PackageList";
import { Package } from "../../common/types";
import './Home.scss';
import Loader from "../../components/Loader/Loader";

const Home = () => {
    const { projectId } = useParams<{projectId: string}>(); 
    const navigate = useNavigate();
    const [packages, setPackages] = useState<Package[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPackageLoading, setIsPackageLoading] = useState(true);
    const [hasPackage, setHasPackage] = useState(false);

    const loadPackages = async () => {
        setIsPackageLoading(true);
        if (projectId) {
            try {
                const response = await getPackagesByProject(projectId);
                if (response.success) {
                    setPackages(response.packages);
                    setHasPackage(response.packages.length > 0);
                }
            } catch (error) {
                console.error("Error loading packages:", error);
            } finally {
                setIsPackageLoading(false);
            }
        } else {
            setIsPackageLoading(false);
        }
    };

    useEffect(() => {
        loadPackages();
    }, [projectId]);

    const handleCreateClick = () => {
        if (hasPackage) {
            return;
        }
        setIsModalVisible(true);
    };

    const onSubmit = async (id: string, module: string) => {
        try {
            await createPackage(projectId!, id, module );
            await createEvents({ packageId: id, module });
            localStorage.setItem('module', module);
            setPackages([{ id, name: `Package ${id}`, module }]);
            setHasPackage(true);
            navigate(`/dashboard/${id}`);
        } catch(error) {
            console.log('Package creation error', error);
        } finally {
            setIsModalVisible(false);
        }
    };

    if (isPackageLoading) return <Loader />;
    
    return (
        <main className="home-page">
            <div className="package-header">
                <button 
                    onClick={handleCreateClick}
                    disabled={hasPackage}
                >
                    {hasPackage ? "Package Created" : "Create Package"}
                </button>
            </div>
            <PackageList packages={packages} />

            {isModalVisible && (
                <PackageModal 
                    onClose={() => setIsModalVisible(false)} 
                    onSubmit={onSubmit}
                />
            )}
        </main>
    )
}

export default Home;