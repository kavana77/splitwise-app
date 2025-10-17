import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/images.png'
import { auth } from '../../firebaseConfig'
import { LuLayoutDashboard } from "react-icons/lu";
import { signOut } from 'firebase/auth'
import DarkModeToggle from '../DarkModeToggle';
import { useState } from 'react';
import { toast} from "sonner";



const NavbarUser = () => {
      const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

    const navigate = useNavigate()
    const user = localStorage.getItem("user")
    const getInitials = (name: string | null)=>{
        if(!name) return ""
        const parts = name.trim().split(" ")
        const initials = parts.map(part => part.charAt(0).toUpperCase()).join("")
        return initials
    }
    const handleLogout = async ()=> {
    await signOut(auth)
    localStorage.removeItem("user")
    toast.success("logged out successfully")
    navigate('/')
}
    return ( 
        <nav className={`relative h-25 w-full flex justify-between bg-emerald-600 px-12 pb-4 md:pr-28 ${isDark ? 'text-black' : 'text-white'}`}>
            <div className='flex gap-2 items-center '>
                <img src={Logo} className='w-10'/>
                 <h1 className="font-bold text-xl ">Splitwise</h1>
            </div>
            <div className='flex items-center gap-4'>
                <Link to='/dashboard' className='hidden border  border-gray-300 px-1 md:flex items-center gap-2 rounded-sm '><LuLayoutDashboard/>Dashboard</Link>
                <div className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 font-bold'>{getInitials(user)}</div>
                <button onClick={handleLogout} className='cursor-pointer'>Logout</button>
            </div>
            <DarkModeToggle onToggle={setIsDark}/>
        </nav>
     );
}
 
export default NavbarUser;