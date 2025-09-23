import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/images.png'
import { auth } from '../../firebaseConfig'


const NavbarUser = () => {
    const navigate = useNavigate()
    const user = localStorage.getItem("user")
    const handleLogout = async ()=> {
    await auth.signOut()
    localStorage.removeItem("user")
    navigate('/')
}
    return ( 
        <nav className="h-10 w-full flex justify-between bg-emerald-600 text-white px-12">
            <div className='flex gap-2 items-center '>
                <img src={Logo} className='w-10'/>
                 <h1 className="font-bold text-xl">Splitwise</h1>
            </div>
            <div className='flex items-center gap-4'>
                <p>{user}</p>
                <button onClick={handleLogout} className='cursor-pointer'>Logout</button>
            </div>
        </nav>
     );
}
 
export default NavbarUser;