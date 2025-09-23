import { Link } from 'react-router-dom';
import Logo from '../../assets/images.png'
const NavbarGuest = () => {
    return ( 
        <nav className="h-10 flex justify-between px-12 my-4">
            <div className='flex gap-2 items-center '>
                <img src={Logo} className='w-10'/>
                 <h1 className="font-bold text-xl">Splitwise</h1>
            </div>
           
            <div className="flex gap-4 items-center">
                <Link to='/login' className="text-emerald-600 cursor-pointer">Log in</Link>
                <Link to='/signup' className="bg-emerald-600 px-2 py-2 rounded-lg text-white">Sign up</Link>
            </div>
        </nav>
     );
}
 
export default NavbarGuest ;