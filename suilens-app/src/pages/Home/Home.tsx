import { useState } from "react"
import { createEvents } from "../../common/api.services"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import './Home.scss'

const Home = () => {
    const navigate = useNavigate();
    const [packageId, SetPackageId] = useState<string>()
    const [module, SetModule] = useState<string>()

    const onSubmit = async () =>{
        try{
            if(packageId && module){
                await createEvents({
                    packageId,
                    module
                })
                toast.success('Successfully created!');
                navigate('/dashboard')
            }else{
                toast.error('Please enter all details')
            }
        } catch(error){
            console.log('Home error', error)
            toast.error('An error occured')
        }
    }

    return(
        <main className="home-container">
            <Toaster />
            <p>Package</p>
            <input required onChange={(e)=>SetPackageId(e.target.value)} placeholder="enter package address" />
            <p>Module</p>
            <input required onChange={(e)=>SetModule(e.target.value)} placeholder="enter module id" />
            
            <button onClick={onSubmit}>submit</button>
        </main>
    )
}

export default Home